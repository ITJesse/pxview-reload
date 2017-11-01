//
//  PXURLProtocol.m
//  PxView
//
//  Created by Jesse Zhu on 2017/10/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PXURLProtocol.h"
#import "PXDNSManager.h"


@implementation PXURLProtocol{
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
  if ([NSURLProtocol propertyForKey:@"PXHooked" inRequest:request]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"localhost"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"dns.xu1s.com"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"dns.google.com"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"cs.gssprt.jp"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"touch.pixiv.net"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"accounts.pixiv.net"]) {
    return NO;
  } else if ([[[request URL] host] containsString:@"source.pixiv.net"]) {
    return NO;
  }
//  NSLog(@"URL: %@", [[request URL] absoluteString]);
  return YES;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
  return request;
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b {
  return [super requestIsCacheEquivalent:a toRequest:b];
}

- (void)startLoading {
  NSMutableURLRequest *mutableReqeust = [[self request] mutableCopy];
  self.hostname = self.request.URL.host;
  [NSURLProtocol setProperty:@YES forKey:@"PXHooked" inRequest:mutableReqeust];
  NSMutableURLRequest *request = [self.class replaceHostInRequset:mutableReqeust];
  self.connection = [NSURLConnection connectionWithRequest:request delegate:self];
}

- (void)stopLoading {
  [self.connection cancel];
  self.connection = nil;
  self.hostname = nil;
}

+ (NSMutableURLRequest *)replaceHostInRequset:(NSMutableURLRequest *)request {
  if ([request.URL host].length == 0) {
    return request;
  }
  
  NSString *originUrlString = [request.URL absoluteString];
  NSString *originHostString = [request.URL host];
  NSRange hostRange = [originUrlString rangeOfString:originHostString];
  if (hostRange.location == NSNotFound) {
    return request;
  }
  
  PXDNSManager *dns = [PXDNSManager sharedManager];
  
  NSString *ip = [dns query:originHostString];
  
  if (ip && ip.length) {
    NSString *urlString = [originUrlString stringByReplacingCharactersInRange:hostRange withString:ip];
    
    NSURL *url = [NSURL URLWithString:urlString];
    request.URL = url;
    NSLog(@"URL: %@", originHostString);
//    request.URL = [NSURL URLWithString:originUrlString];
    
    [request setValue:originHostString forHTTPHeaderField:@"Host"];
  }
  
  return request;
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageAllowed];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
  [self.client URLProtocol:self didLoadData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
  [self.client URLProtocolDidFinishLoading:self];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
  [self.client URLProtocol:self didFailWithError:error];
}

- (BOOL)connectionShouldUseCredentialStorage:(NSURLConnection *)connection
{
  return YES;
}

- (BOOL)evaluateServerTrust:(SecTrustRef)serverTrust
                  forDomain:(NSString *)domain {
  /*
   * 创建证书校验策略
   */
  NSMutableArray *policies = [NSMutableArray array];
  if (domain) {
    [policies addObject:(__bridge_transfer id) SecPolicyCreateSSL(true, (__bridge CFStringRef) domain)];
  } else {
    [policies addObject:(__bridge_transfer id) SecPolicyCreateBasicX509()];
  }
  /*
   * 绑定校验策略到服务端的证书上
   */
  SecTrustSetPolicies(serverTrust, (__bridge CFArrayRef) policies);
  /*
   * 评估当前serverTrust是否可信任，
   * 官方建议在result = kSecTrustResultUnspecified 或 kSecTrustResultProceed
   * 的情况下serverTrust可以被验证通过，developer.apple.com/library/ios/technotes/tn2232/_index.html
   * 关于SecTrustResultType的详细信息请参考SecTrust.h
   */
  SecTrustResultType result;
  SecTrustEvaluate(serverTrust, &result);
  NSString *logResult = (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed) ? @"1" : @"2";
  NSLog(@"Test Domain %@ %@", domain, logResult);
  return (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
}

- (void)connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge
{
  if (!challenge) {
    return;
  }
  /*
   * URL里面的host在使用HTTPDNS的情况下被设置成了IP，此处从HTTP Header中获取真实域名
   */
  NSString *host = [[self.request allHTTPHeaderFields] objectForKey:@"host"];
  if (!host) {
    host = self.request.URL.host;
  }
  /*
   * 判断challenge的身份验证方法是否是NSURLAuthenticationMethodServerTrust（HTTPS模式下会进行该身份验证流程），
   * 在没有配置身份验证方法的情况下进行默认的网络请求流程。
   */
  if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
    if ([self evaluateServerTrust:challenge.protectionSpace.serverTrust forDomain:host]) {
      /*
       * 验证完以后，需要构造一个NSURLCredential发送给发起方
       */
      NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
      [[challenge sender] useCredential:credential forAuthenticationChallenge:challenge];
    } else {
      /*
       * 验证失败，取消这次验证流程
       */
      [[challenge sender] continueWithoutCredentialForAuthenticationChallenge:challenge];
      NSLog(@"HTTPS Failed %@", host);
    }
  } else {
    /*
     * 对于其他验证方法直接进行处理流程
     */
    [[challenge sender] continueWithoutCredentialForAuthenticationChallenge:challenge];
  }
}

@end
