//
//  PXUtils.m
//  PxView
//
//  Created by Jesse Zhu on 2017/10/30.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#include <ifaddrs.h>
#include <arpa/inet.h>
#import <sys/utsname.h>
#import <SystemConfiguration/SystemConfiguration.h>
#include <arpa/inet.h>
#include <ifaddrs.h>
#include <resolv.h>
#include <dns.h>
#import "PXUtils.h"
#import "HappyDNS.h"
#import "HTTPDNS.h"
@import Firebase;
@import CoreTelephony;

@implementation PXUtils

- (id)init {
  [FIRApp configure];
  return self;
}

+ (NSString *)getIPAddress {
  NSString *address = @"error";
  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;
  int success = 0;
  // retrieve the current interfaces - returns 0 on success
  success = getifaddrs(&interfaces);
  if (success == 0) {
    // Loop through linked list of interfaces
    temp_addr = interfaces;
    while(temp_addr != NULL) {
      if(temp_addr->ifa_addr->sa_family == AF_INET) {
        // Check if interface is en0 which is the wifi connection on the iPhone
        if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
          // Get NSString from C String
          address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];
        }
      }
      temp_addr = temp_addr->ifa_next;
    }
  }
  // Free memory
  freeifaddrs(interfaces);
  return address;
}

+ (NSString *)getDeviceName {
  struct utsname systemInfo;
  uname(&systemInfo);
  
  return [NSString stringWithCString:systemInfo.machine
                            encoding:NSUTF8StringEncoding];
}

+ (float)getOSVersion {
  float ver = [[[UIDevice currentDevice] systemVersion] floatValue];
  return ver;
}

+ (NSString *)getRadioType {
  CTTelephonyNetworkInfo *telephonyInfo = [[CTTelephonyNetworkInfo alloc] init];
  NSString *currentRadio = telephonyInfo.currentRadioAccessTechnology;
  return currentRadio;
}

+ (NSString *)getCarrierInfo {
  CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
  CTCarrier *carrier = info.subscriberCellularProvider;
  return [carrier description];
}

+ (NSString *)getNetworkType {
  SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(NULL, "114.114.114.114");
  SCNetworkReachabilityFlags flags;
  BOOL success = SCNetworkReachabilityGetFlags(reachability, &flags);
  CFRelease(reachability);
  if (!success) {
    return @"Unknown";
  }
  BOOL isReachable = ((flags & kSCNetworkReachabilityFlagsReachable) != 0);
  BOOL needsConnection = ((flags & kSCNetworkReachabilityFlagsConnectionRequired) != 0);
  BOOL isNetworkReachable = (isReachable && !needsConnection);
  
  if (!isNetworkReachable) {
    return @"None";
  } else if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
    return @"Carrier";
  } else {
    return @"WWAN";
  }
}

+ (NSString *) getFilePath:(NSString *)filename {
  NSArray *paths = NSSearchPathForDirectoriesInDomains
  (NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  NSString *filePath = [NSString stringWithFormat:@"%@/%@",
                        documentsDirectory, filename];
  return filePath;
}

+ (void) writeToTextFile:(NSString*)filePath content:(NSString *)content {
  NSString *oldContents = [NSString stringWithContentsOfFile:filePath
                                                    encoding:NSUTF8StringEncoding
                                                       error:nil];
  content = [[oldContents stringByAppendingString:@"\n"] stringByAppendingString:content];
  [content writeToFile:filePath
            atomically:YES
              encoding:NSUTF8StringEncoding
                 error:nil];
}

+ (void) cleanFile:(NSString*)filePath {
  NSString *content = @"";
  [content writeToFile:filePath
            atomically:NO
              encoding:NSUTF8StringEncoding
                 error:nil];
}

- (void)uploadFile:(NSString *)filePath {
  FIRStorage *storage = [FIRStorage storage];
  FIRStorageReference *storageRef = [storage reference];
  
  NSString *uniqueIdentifier = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  NSLog(@"UUID %@", uniqueIdentifier);
  FIRStorageReference *deviceRef = [[storageRef child:@"logs"] child:uniqueIdentifier];
  
  NSTimeInterval timeStamp = [[NSDate date] timeIntervalSince1970];
  NSString *logFilename = [NSString stringWithFormat:@"%f.log", timeStamp];
  FIRStorageReference *logRef = [deviceRef child:logFilename];
  
  // File located on disk
  NSURL *localFile = [NSURL fileURLWithPath:filePath];
  
  FIRStorageUploadTask *uploadTask = [logRef putFile:localFile metadata:nil completion:^(FIRStorageMetadata *metadata, NSError *error) {
    if (error != nil) {
      // Uh-oh, an error occurred!
      NSLog(@"error %@", error);
    } else {
      // Metadata contains file metadata such as size, content-type, and download URL.
      NSURL *downloadURL = metadata.downloadURL;
      NSLog(@"downloadURL %@", downloadURL);
    }
  }];
}

+ (NSString *) readTextFromFile:(NSString*)filePath {
  NSString *content = [NSString stringWithContentsOfFile:filePath
                                                    encoding:NSUTF8StringEncoding
                                                       error:nil];
  return content;
}

+ (NSString *)getDNSServers {
  res_state res = malloc(sizeof(struct __res_state));
  int result = res_ninit(res);
  
  if ( result == 0 ) {
    if (res->nscount > 0) {
      NSString *s = [NSString stringWithUTF8String :  inet_ntoa(res->nsaddr_list[0].sin_addr)];
      return [NSString stringWithFormat:@"%@", s];
    } else {
      return nil;
    }
  } else {
    return nil;
  }
}

+ (Boolean)reachableTest:(NSString *)target {
  bool success = false;
  const char *host_name = [target cStringUsingEncoding:NSASCIIStringEncoding];
  
  SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(NULL,
                                                                              host_name);
  SCNetworkReachabilityFlags flags;
  success = SCNetworkReachabilityGetFlags(reachability, &flags);
  
  //prevents memory leak per Carlos Guzman's comment
  CFRelease(reachability);
  
  bool isAvailable = success && (flags & kSCNetworkFlagsReachable) &&
  !(flags & kSCNetworkFlagsConnectionRequired);
  if (isAvailable) {
    return true;
  } else {
    return false;
  }
}

+ (void)collectDeviceInfomation {
  NSString *deviceName = [NSString stringWithFormat:@"Device Name: %@", [self getDeviceName]];
  NSString *osVer = [NSString stringWithFormat:@"OS Version: %f", [self getOSVersion]];
  NSString *log = [NSString stringWithFormat:@"%@\n%@\n\n", deviceName, osVer];
  [self writeToTextFile:[self getFilePath:@"Log.txt"] content:log];
}

+ (void)collectNetworkInfomation {
  NSString *ipAddress = [NSString stringWithFormat:@"IP Address: %@", [self getIPAddress]];
  NSString *carrier = [NSString stringWithFormat:@"Carrier Name: %@", [self getCarrierInfo]];
  NSString *radioType = [NSString stringWithFormat:@"Radio Access Technology: %@", [self getRadioType]];
  NSString *networkType = [NSString stringWithFormat:@"Network Type: %@", [self getNetworkType]];
  NSString *dnsServer = [NSString stringWithFormat:@"DNS Server: %@", [self getDNSServers]];
  NSString *log = [NSString stringWithFormat:@"%@\n%@\n%@\n%@\n%@\n\n", ipAddress, carrier, radioType, networkType, dnsServer];
  [self writeToTextFile:[self getFilePath:@"Log.txt"] content:log];
}

+ (void)collectReachableInfomation {
  QNDnsManager *dns;
  NSMutableArray *array;
  NSArray *queryArray;
  
  NSMutableString *log = [NSMutableString stringWithCapacity:1000];
  [log appendString:@"Reachable Test:\n"];
  
  [log appendString:@"Google DNS\n"];
  [log appendString:[NSString stringWithFormat:@"Reachable: %d\n\n", [self reachableTest:@"8.8.8.8"]]];
  [log appendString:@"Google DNS over HTTPS\n"];
  [log appendString:[NSString stringWithFormat:@"Reachable: %d\n\n", [self reachableTest:@"dns.xu1s.com"]]];
  [log appendString:@"114 DNS\n"];
  [log appendString:[NSString stringWithFormat:@"Reachable: %d\n\n", [self reachableTest:@"114.114.114.114"]]];
  
  array = [[NSMutableArray alloc] init];
  [array addObject:[QNResolver systemResolver]];
  dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
  queryArray = [dns query:@"app-api.pixiv.net"];
  [log appendString:@"Pixiv server with system resolver\n"];
  [log appendString:[NSString stringWithFormat:@"IP: %@\nReachable: %d\n\n", queryArray[0], [self reachableTest:queryArray[0]]]];
  
  array = [[NSMutableArray alloc] init];
  [array addObject:[[QNResolver alloc] initWithAddress:@"8.8.8.8" timeout:3]];
  dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
  queryArray = [dns query:@"app-api.pixiv.net"];
  [log appendString:@"Pixiv server with Google DNS over TCP\n"];
  [log appendString:[NSString stringWithFormat:@"IP: %@\nReachable: %d\n\n", queryArray[0], [self reachableTest:queryArray[0]]]];
  
  array = [[NSMutableArray alloc] init];
  [array addObject:[[QNResolver alloc] initWithAddress:@"114.114.114.114" timeout:3]];
  dns = [[QNDnsManager alloc] init:array networkInfo:[QNNetworkInfo normal]];
  queryArray = [dns query:@"app-api.pixiv.net"];
  [log appendString:@"Pixiv server with 114 DNS over TCP\n"];
  [log appendString:[NSString stringWithFormat:@"IP: %@\nReachable: %d\n\n", queryArray[0], [self reachableTest:queryArray[0]]]];
  
  __block NSString *ip = nil;
  
  [[HTTPDNSClient sharedInstance] useGoogle];
  dispatch_semaphore_t sem = dispatch_semaphore_create(0);
  [[HTTPDNSClient sharedInstance] getRecord:@"app-api.pixiv.net" callback:^(HTTPDNSRecord *record) {
    ip = record.ip;
    dispatch_semaphore_signal(sem);
  }];
  dispatch_time_t  t = dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC);
  dispatch_semaphore_wait(sem, t);
  [log appendString:@"Pixiv server with Google DNS over HTTPS\n"];
  [log appendString:[NSString stringWithFormat:@"IP: %@\nReachable: %d\n\n", ip, [self reachableTest:ip]]];
  
  [self writeToTextFile:[self getFilePath:@"Log.txt"] content:log];
}

@end
