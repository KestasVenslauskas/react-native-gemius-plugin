#import "LRTGemiusPlugin.h"
#import <GemiusSDK/GemiusSDK.h>

@implementation LRTGemiusPlugin {
  GSMPlayer *player;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (NSString *)moduleName
{
  return @"LRTGemiusPlugin";
}

- (void)setAppInfo:(NSString *)app version:(NSString *)version gemiusHitCollectorHost:(NSString *)gemiusHitCollectorHost gemiusPrismIdentifier:(NSString *)gemiusPrismIdentifier
{
  [[GEMAudienceConfig sharedInstance] setHitcollectorHost:gemiusHitCollectorHost];
  [[GEMAudienceConfig sharedInstance] setScriptIdentifier:gemiusPrismIdentifier];
  [[GEMConfig sharedInstance] setLoggingEnabled:YES];
  [[GEMConfig sharedInstance] setAppInfo:app version:version];
}

- (void)sendPageViewedEvent:(NSString *)gemiusPrismIdentifier extraParameters:(NSDictionary * _Nullable)extraParameters
{
  GEMAudienceEvent *event = [GEMAudienceEvent new];
  [event setEventType:GEM_EVENT_FULL_PAGEVIEW];
  [event setScriptIdentifier:gemiusPrismIdentifier];

  if (extraParameters != nil) {
    for (NSString *key in extraParameters) {
      id value = extraParameters[key];
      NSString *stringValue = [value isKindOfClass:[NSString class]] ? value : [NSString stringWithFormat:@"%@", value];
      [event addExtraParameter:key value:stringValue];
    }
  }
  [event sendEvent];
}

- (void)sendPartialPageViewedEvent:(NSString *)gemiusPrismIdentifier extraParameters:(NSDictionary * _Nullable)extraParameters
{
  GEMAudienceEvent *event = [GEMAudienceEvent new];
  [event setEventType:GEM_EVENT_PARTIAL_PAGEVIEW];
  [event setScriptIdentifier:gemiusPrismIdentifier];

  if (extraParameters != nil) {
    for (NSString *key in extraParameters) {
      id value = extraParameters[key];
      NSString *stringValue = [value isKindOfClass:[NSString class]] ? value : [NSString stringWithFormat:@"%@", value];
      [event addExtraParameter:key value:stringValue];
    }
  }
  [event sendEvent];
}

- (void)sendActionEvent:(NSString *)gemiusPrismIdentifier extraParameters:(NSDictionary * _Nullable)extraParameters
{
  GEMAudienceEvent *event = [GEMAudienceEvent new];
  [event setEventType:GEM_EVENT_ACTION];
  [event setScriptIdentifier:gemiusPrismIdentifier];

  if (extraParameters != nil) {
    for (NSString *key in extraParameters) {
      id value = extraParameters[key];
      NSString *stringValue = [value isKindOfClass:[NSString class]] ? value : [NSString stringWithFormat:@"%@", value];
      [event addExtraParameter:key value:stringValue];
    }
  }
  [event sendEvent];
}

- (void)setPlayerInfo:(NSString *)playerId serverHost:(NSString *)serverHost accountId:(NSString *)accountId
{
  NSLog(@"Initializing player...");
  if (player == nil) {
    player = [[GSMPlayer alloc] initWithID:playerId withHost:serverHost withGemiusID:accountId withData:nil];
  } else {
    NSLog(@"Player already initialized!");
  }
}

- (void)setProgramData:(NSString *)clipId name:(NSString *)name duration:(double)duration type:(NSString *)type
{
  NSNumber *durationNumber = [NSNumber numberWithDouble:duration];
  NSLog(@"Setting new program data for %@ with duration %@", name, durationNumber);

  GSMProgramData *pdata = [[GSMProgramData alloc] init];
  pdata.duration = durationNumber;
  pdata.name = name;
  if ([type isEqualToString:@"audio"]) {
    pdata.programType = GSM_AUDIO;
  } else {
    pdata.programType = GSM_VIDEO;
  }

  [player newProgram:clipId withData:pdata];
}

- (void)sendPlay:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player PLAY event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    GSMEventProgramData *data = [[GSMEventProgramData alloc] init];
    data.autoPlay = [NSNumber numberWithBool:YES];
    [player programEvent:GSM_PLAY forProgram:clipId atOffset:offsetNumber withData:data];
  }
}

- (void)sendPause:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player PAUSE event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_PAUSE forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (void)sendStop:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player STOP event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_STOP forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (void)sendBuffer:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player BUFFER event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_BUFFER forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (void)sendClose:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player CLOSE event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_CLOSE forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (void)sendSeek:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player SEEK event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_SEEK forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (void)sendComplete:(NSString *)clipId offset:(double)offset
{
  NSNumber *offsetNumber = [NSNumber numberWithDouble:offset];
  NSLog(@"Player COMPLETE event for '%@' offset: %@", clipId, offsetNumber);

  if (player) {
    [player programEvent:GSM_COMPLETE forProgram:clipId atOffset:offsetNumber withData:nil];
  }
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeLRTGemiusPluginSpecJSI>(params);
}

@end
