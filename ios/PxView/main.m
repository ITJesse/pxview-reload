/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <objc/runtime.h>
#include <dlfcn.h>
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#import "AppDelegate.h"
#import "PXURLProtocol.h"
#import <objc/runtime.h>

@interface NSObject (URLProtocolHook)
- (NSURLSessionConfiguration *)zw_defaultSessionConfiguration;
+ (void)hook;
@end

@implementation NSObject (URLProtocolHook)

- (NSURLSessionConfiguration *)zw_defaultSessionConfiguration {
  NSURLSessionConfiguration *configuration = [self zw_defaultSessionConfiguration];
  NSArray *protocolClasses = @[[PXURLProtocol class]];
  NSLog(@"Hooked NSURLSessionConfiguration");
  configuration.protocolClasses = protocolClasses;
  
  return configuration;
}

+ (void)hook {
  Method systemMethod = class_getClassMethod([NSURLSessionConfiguration class], @selector(defaultSessionConfiguration));
  Method zwMethod = class_getClassMethod([self class], @selector(zw_defaultSessionConfiguration));
  if (systemMethod && zwMethod) {
    method_exchangeImplementations(systemMethod, zwMethod);
    NSLog(@"Switched NSURLSessionConfiguration");
  }
  
  [NSURLProtocol registerClass:[PXURLProtocol class]];
}

@end

int main(int argc, char * argv[]) {
  @autoreleasepool {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
//      [NSObject hook];
    });
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
