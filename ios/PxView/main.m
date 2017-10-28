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
+ (void)hook;
@end

@implementation NSObject (URLProtocolHook)

- (NSURLSessionConfiguration *)zw_defaultSessionConfiguration
{
  NSURLSessionConfiguration *configuration = [self zw_defaultSessionConfiguration];
  NSArray *protocolClasses = @[[PXURLProtocol class]];
  configuration.protocolClasses = protocolClasses;
  NSLog(@"defaultSessionConfiguration");
  
  return configuration;
}

+ (void)hook
{
  Method systemMethod = class_getClassMethod([NSURLSessionConfiguration class], @selector(defaultSessionConfiguration));
  Method zwMethod = class_getClassMethod([self class], @selector(zw_defaultSessionConfiguration));
  method_exchangeImplementations(systemMethod, zwMethod);
  
  [NSURLProtocol registerClass:[PXURLProtocol class]];
  NSLog(@"Switched");
}

@end

int main(int argc, char * argv[]) {
  [NSObject hook];
  @autoreleasepool {
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
