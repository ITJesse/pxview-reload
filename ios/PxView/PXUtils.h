//
//  PXUtils.h
//  PxView
//
//  Created by Jesse Zhu on 2017/10/30.
//  Copyright © 2017年 Facebook. All rights reserved.
//

@interface PXUtils : NSObject
- (id)init;
+ (void)cleanFile:(NSString *)filename;
+ (NSString *)getIPAddress;
+ (NSString *)getDeviceName;
+ (float)getOSVersion;
+ (NSString *)getRadioType;
+ (NSString *)getCarrierInfo;
+ (NSString *)getNetworkType;
+ (NSString *)getFilePath:(NSString *)filename;
+ (void)writeToTextFile:(NSString*)filePath content:(NSString *)content;
+ (NSString *) readTextFromFile:(NSString*)filePath;
- (void)uploadFile:(NSString *)filePath;
+ (void)collectDeviceInfomation;
+ (void)collectNetworkInfomation;
+ (void)collectReachableInfomation;
@end
