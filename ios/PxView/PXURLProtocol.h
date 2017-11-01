//
//  PXURLProtocol.h
//  PxView
//
//  Created by Jesse Zhu on 2017/10/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PXURLProtocol : NSURLProtocol
@property(nonatomic, strong) NSURLConnection *connection;
@property(nonatomic, copy) NSString *hostname;
@property(nonatomic) NSInteger retryCount;
@end
