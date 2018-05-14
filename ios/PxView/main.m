/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <objc/runtime.h>
#include <dlfcn.h>
#include <stdio.h>
#include <sys/socket.h>
#include <unistd.h>
#import <objc/runtime.h>
#import "AppDelegate.h"


int main(int argc, char * argv[]) {
  @autoreleasepool {
    NSString *cachesPath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
    NSString *filePathAndDirectory = [cachesPath stringByAppendingPathComponent:@"pxview"];
    [[NSFileManager defaultManager] createDirectoryAtPath:filePathAndDirectory
                              withIntermediateDirectories:NO
                                               attributes:nil
                                                    error:nil];
    filePathAndDirectory = [cachesPath stringByAppendingPathComponent:@"tmp"];
    [[NSFileManager defaultManager] removeItemAtPath:filePathAndDirectory
                                               error:nil];
    [[NSFileManager defaultManager] createDirectoryAtPath:filePathAndDirectory
                              withIntermediateDirectories:NO
                                               attributes:nil
                                                    error:nil];
    
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
