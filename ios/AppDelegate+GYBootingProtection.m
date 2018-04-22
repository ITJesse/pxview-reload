//
//  AppDelegate+GYBootingProtection.m
//  WeRead
//
//  Created by richliu on 16/5/19.
//

#import "AppDelegate+GYBootingProtection.h"
#import <objc/runtime.h>
#import "GYBootingProtection.h"

static NSString *const fixCrashAlertTitle = @"Error";
static NSString *const fixCrashButtonTitle = @"Fix";
static NSString *const cancelButtonTitle = @"Cancel";
static NSString *const mainStoryboardInfoKey = @"UIMainStoryboardFile";

@implementation AppDelegate (GYBootingProtection)

/*
 * 连续闪退检测前需要执行的逻辑，如上报统计初始化
 */
- (void)onBeforeBootingProtection {

#pragma mark TODO
    
    [GYBootingProtection setLogger:^(NSString *msg) {
        // 设置Logger
        NSLog(@"GYBootingProtection: %@", msg);
    }];
    
    [GYBootingProtection setReportBlock:^(NSInteger crashCounts) {
        // crash 上报逻辑
    }];
  
}

#pragma mark - Method Swizzling

/**
 * 连续闪退检测逻辑，Method Swizzle 了原来 didFinishLaunch
 * 如果检测到连续闪退，提示用户进行修复
 */
- (BOOL)swizzled_application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    [self onBeforeBootingProtection];
    
    // only protect tapping icon launch
    if (launchOptions != nil) {
        return [self swizzled_application:application didFinishLaunchingWithOptions:launchOptions];
    }

    /* ------- 启动连续闪退保护 ------- */
    
    [GYBootingProtection setBoolCompletionBlock:^BOOL{

        // 原 didFinishLaunch 正常启动流程
        return [self swizzled_application:application didFinishLaunchingWithOptions:launchOptions];
    }];

    return [GYBootingProtection launchContinuousCrashProtect];
}

/** 
 * 判断项目是否是用 info.plist 配置 storyboard 的，
 * 是的话就不需要手动初始化 window 和 rootViewController
 */
- (BOOL)hasStoryboardInfo {
    return [[NSBundle mainBundle] objectForInfoDictionaryKey:mainStoryboardInfoKey];
}

#pragma mark - Method Swizzling
+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [super class];
        
        // When swizzling a class method, use the following:
        // Class class = object_getClass((id)self);
        
        SEL originalSelector = @selector(application:didFinishLaunchingWithOptions:);
        SEL swizzledSelector = @selector(swizzled_application:didFinishLaunchingWithOptions:);
        
        Method originalMethod = class_getInstanceMethod(class, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
        
        BOOL didAddMethod =
        class_addMethod(class,
                        originalSelector,
                        method_getImplementation(swizzledMethod),
                        method_getTypeEncoding(swizzledMethod));
        
        if (didAddMethod) {
            class_replaceMethod(class,
                                swizzledSelector,
                                method_getImplementation(originalMethod),
                                method_getTypeEncoding(originalMethod));
        } else {
            method_exchangeImplementations(originalMethod, swizzledMethod);
        }
    });
}

@end
