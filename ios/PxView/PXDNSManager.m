//
//  PXDNSManager.m
//  PxView
//
//  Created by Jesse Zhu on 2017/10/29.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PXDNSManager.h"
#import "HTTPDNS.h"
#import "HappyDNS.h"

@implementation PXDNSManager
{
  QNDnsManager *_dns;
}

#pragma mark Singleton Methods

+ (id)sharedManager {
  static PXDNSManager *_sharedPXDNSManager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _sharedPXDNSManager = [[PXDNSManager alloc] init];
  });
  return _sharedPXDNSManager;
}

- (id)init {
  if (self = [super init]) {
    //  NSLog(@"NeedHttpDns %@", [QNDnsManager needHttpDns] ? @"True" : @"False");
    [[HTTPDNSClient sharedInstance] useGoogle];
     
    if ([QNDnsManager needHttpDns]){
      NSMutableArray *array = [[NSMutableArray alloc] init];
      [array addObject:[[QNResolver alloc] initWithAddress:@"114.114.114.114" timeout:3]];
      [array addObject:[QNResolver systemResolver]];
      _dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
    } else {
      NSMutableArray *array = [[NSMutableArray alloc] init];
      [array addObject:[QNResolver systemResolver]];
      [array addObject:[[QNResolver alloc] initWithAddress:@"8.8.8.8" timeout:3]];
      _dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
    }
  }
  return self;
}

- (NSString *)query:(NSString *)domain {
  __block NSString *ip = nil;
  
  if ([QNDnsManager needHttpDns]) {
    dispatch_semaphore_t sem = dispatch_semaphore_create(0);
    [[HTTPDNSClient sharedInstance] getRecord:domain callback:^(HTTPDNSRecord *record) {
      NSLog(@"Using DNS over HTTPS: %@", record.ip);
      ip = record.ip;
      dispatch_semaphore_signal(sem);
    }];
    
    dispatch_time_t  t = dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC);
    dispatch_semaphore_wait(sem, t);
  }
  
  if (!ip) {
    if ([QNDnsManager needHttpDns]) NSLog(@"DNS over Https Timeout.");
    NSArray *queryArray = [_dns query:domain];
    if (queryArray && queryArray.count > 0) {
      ip = queryArray[0];
      NSLog(@"Using DNS over TCP: %@", ip);
    } else {
      NSLog(@"DNS over TCP failed. Fallback to system DNS resolver.");
    }
  }
  
  return ip;
}

- (void)dealloc {
  // Should never be called, but just here for clarity really.
}

@end
