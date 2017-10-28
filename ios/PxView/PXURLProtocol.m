//
//  PXURLProtocol.m
//  PxView
//
//  Created by Jesse Zhu on 2017/10/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PXURLProtocol.h"

@implementation PXURLProtocol{
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
  if ([NSURLProtocol propertyForKey:@"PXHooked" inRequest:request]) {
    return NO;
  } else if ([[[request URL] host] hasPrefix:@"localhost"]) {
    return NO;
  }
  NSString *scheme = [[request URL] scheme];
  if (([scheme caseInsensitiveCompare:@"http"] == NSOrderedSame)) {
    NSLog(@"URL: %@", [request URL]);
    return YES;
  }
  
  return NO;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
  return request;
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b {
  return [super requestIsCacheEquivalent:a toRequest:b];
}

- (void)startLoading {
  NSMutableURLRequest *mutableReqeust = [[self request] mutableCopy];
  [NSURLProtocol setProperty:@YES forKey:@"PXHooked" inRequest:mutableReqeust];
  self.connection = [NSURLConnection connectionWithRequest:self.request delegate:self];
}

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
  [self.client URLProtocol:self didLoadData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
  [self.client URLProtocolDidFinishLoading:self];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
  [self.client URLProtocol:self didFailWithError:error];
}

@end
