//
//  GYBootingProtection.m
//  GYMonitor
//
//  Created by jasenhuang on 15/12/22.
//

#import "GYBootingProtection.h"
#import <QuartzCore/QuartzCore.h>

void (^Logger)(NSString *log);
ReportBlock reportBlock;
BoolCompletionBlock boolCompletionBlock;

static NSString *const kContinuousCrashOnLaunchCounterKey = @"ContinuousCrashOnLaunchCounter";
static NSString *const kContinuousCrashFixingKey = @"ContinuousCrashFixing"; // 是否正在修复
static CFTimeInterval const kCrashOnLaunchTimeIntervalThreshold = 10.0;
static CFTimeInterval g_startTick; // 记录启动时刻

@implementation GYBootingProtection

+ (BOOL)launchContinuousCrashProtect
{
    if (Logger) Logger(@"Launch continuous crash report");
    
    NSInteger launchCrashes = [self crashCount];
    
    [self setCrashCount:[self crashCount]+1];


    // 记录启动时刻，用于计算启动连续 crash
    g_startTick = CACurrentMediaTime();
    // 重置启动 crash 计数
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(kCrashOnLaunchTimeIntervalThreshold * NSEC_PER_SEC)), dispatch_get_main_queue(), ^(void){
        // APP活过了阈值时间，重置崩溃计数
        if (Logger) Logger([NSString stringWithFormat:@"long live the app ( more than %@ seconds ), now reset crash counts", @(kCrashOnLaunchTimeIntervalThreshold)]);
        [self setCrashCount:0];
    });
    
  
    // 正常启动流程
    if (Logger) Logger(@"need no repair");
    if (boolCompletionBlock) {
        if (Logger) Logger(@"will execute completion block");
        return boolCompletionBlock();
    }
    return NO;
}

+ (void)setCrashCount:(NSInteger)count
{
    if (Logger) Logger([NSString stringWithFormat:@"setCrashCount:%@", @(count)]);
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setInteger:count forKey:kContinuousCrashOnLaunchCounterKey];
    [defaults synchronize];
}

+ (NSInteger)crashCount
{
    NSInteger crashCount = [[NSUserDefaults standardUserDefaults] integerForKey:kContinuousCrashOnLaunchCounterKey];
    if (Logger) Logger([NSString stringWithFormat:@"crashCount:%@", @(crashCount)]);
    return crashCount;
}

+ (void)setLogger:(void (^)(NSString *))logger
{
    Logger = [logger copy];
}

+ (void)setReportBlock:(ReportBlock)block
{
    reportBlock = block;
}

+ (void)setBoolCompletionBlock:(BoolCompletionBlock)block
{
    boolCompletionBlock = block;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(crashCount:(RCTResponseSenderBlock)cb) {
  NSString *crashCount = [[NSUserDefaults standardUserDefaults] stringForKey:kContinuousCrashOnLaunchCounterKey];
  if (Logger) Logger([NSString stringWithFormat:@"crashCount:%@", crashCount]);
  cb(@[crashCount]);
}

RCT_EXPORT_METHOD(resetCrashCount) {
  if (Logger) Logger([NSString stringWithFormat:@"setCrashCount:%@", @(0)]);
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setInteger:0 forKey:kContinuousCrashOnLaunchCounterKey];
  [defaults synchronize];
}

@end
