//
//  PXURLProtocol.m
//  PxView
//
//  Created by Jesse Zhu on 2017/10/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PXURLProtocol.h"
#import "HappyDNS.h"
#import "HTTPDNS.h"


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
  }
//  NSLog(@"URL: %@", [request URL]);
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
  
  QNDnsManager *dns;
//  NSLog(@"NeedHttpDns %@", [QNDnsManager needHttpDns] ? @"True" : @"False");
  if ([QNDnsManager needHttpDns]){
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:[[QNResolver alloc] initWithAddress:@"114.114.114.114" timeout:3]];
    [array addObject:[QNResolver systemResolver]];
    dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
  } else {
    NSMutableArray *array = [[NSMutableArray alloc] init];
    [array addObject:[QNResolver systemResolver]];
    [array addObject:[[QNResolver alloc] initWithAddress:@"8.8.8.8" timeout:3]];
    dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
  }
 
  __block NSString *ip = nil;
  
  if ([QNDnsManager needHttpDns]) {
    [[HTTPDNSClient sharedInstance] useGoogle];
    dispatch_semaphore_t sem = dispatch_semaphore_create(0);
    
    
    [[HTTPDNSClient sharedInstance] getRecord:originHostString callback:^(HTTPDNSRecord *record) {
      NSLog(@"IP : %@", record.ip);
      ip = record.ip;
      dispatch_semaphore_signal(sem);
    }];
    
    dispatch_time_t  t = dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC);
    dispatch_semaphore_wait(sem, t);
  }
  
  if (!ip) {
    NSArray *queryArray = [dns query:originHostString];
    if (queryArray && queryArray.count > 0) {
      ip = queryArray[0];
    }
  }
  
  if (ip && ip.length) {
    NSString *urlString = [originUrlString stringByReplacingCharactersInRange:hostRange withString:ip];
    
    NSURL *url = [NSURL URLWithString:urlString];
    request.URL = url;
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

- (void)connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge
{
  if ([challenge previousFailureCount]== 0) {
    NSURLCredential* cre = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
    [challenge.sender useCredential:cre forAuthenticationChallenge:challenge];
    [challenge.sender continueWithoutCredentialForAuthenticationChallenge:challenge];
  }
  else
  {
    [challenge.sender cancelAuthenticationChallenge:challenge];
  }
  
}

@end
