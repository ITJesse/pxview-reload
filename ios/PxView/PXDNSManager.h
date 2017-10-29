//
//  PXDNSManager.h
//  PxView
//
//  Created by Jesse Zhu on 2017/10/29.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <foundation/Foundation.h>
#import "HappyDNS.h"

@interface PXDNSManager : NSObject

+ (id)sharedManager;
- (NSString *)query:(NSString *)domain;

@end

