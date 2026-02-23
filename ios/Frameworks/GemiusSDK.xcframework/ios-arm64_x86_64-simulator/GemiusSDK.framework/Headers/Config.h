//
//  Config.h
//  GemiusSDK
//
//  Copyright © 2018 Gemius. All rights reserved.
//

#import <UIKit/UIKit.h>

#define GEM_SDK_NAME    @"GemiusSDK"
#define GEM_SDK_VERSION @"2.3.0"

typedef NS_ENUM(NSUInteger, GEMDataProcessingConsentSource) {
    GEMDataProcessingConsentSourceManual = 0,
    GEMDataProcessingConsentSourceCMP,
    GEMDataProcessingConsentSourceTCString,
};

NS_ASSUME_NONNULL_BEGIN

FOUNDATION_EXPORT NSNotificationName const GEMUserAgentDidChangeNotification;

@interface GEMConfig : NSObject

@property (nonatomic) BOOL loggingEnabled;
@property (nonatomic) BOOL cookiesAllowed;
@property (nonatomic) BOOL IDFACollectionEnabled;
@property (nonatomic) GEMDataProcessingConsentSource dataProcessingConsentSource;
@property (nonatomic) NSTimeInterval cmpTimeout;
@property (nonatomic, copy) NSSet<NSNumber *> *audiencePurposes;
@property (nonatomic, copy) NSSet<NSNumber *> *adOceanPurposes;

+ (GEMConfig *)sharedInstance;
+ (NSString *)getSdkVersion;

- (void)setAppInfo:(NSString *)name version:(NSString *)version;
- (void)setTCString:(nullable NSString *)tcString gdprApplies:(BOOL)gdprApplies;
- (NSString *)getUA4WebView;
- (void)restoreAudiencePurposes;
- (void)restoreAdOceanPurposes;

@end

NS_ASSUME_NONNULL_END
