import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type GemiusParams = {
  [key: string]: string | number | boolean | undefined | null;
};

export interface Spec extends TurboModule {
  setAppInfo(
    app: string,
    version: string,
    gemiusHitCollectorHost: string,
    gemiusPrismIdentifier: string
  ): void;

  setPlayerInfo(playerId: string, serverHost: string, accountId: string): void;

  setProgramData(
    clipId: string,
    name: string,
    duration: number,
    type: string
  ): void;

  sendPlay(clipId: string, offset: number): void;
  sendPause(clipId: string, offset: number): void;
  sendBuffer(clipId: string, offset: number): void;
  sendStop(clipId: string, offset: number): void;
  sendComplete(clipId: string, offset: number): void;
  sendClose(clipId: string, offset: number): void;
  sendSeek(clipId: string, offset: number): void;

  sendPartialPageViewedEvent(
    gemiusPrismIdentifier: string,
    extraParameters: Object | null
  ): void;

  sendPageViewedEvent(
    gemiusPrismIdentifier: string,
    extraParameters: Object | null
  ): void;

  sendActionEvent(
    gemiusPrismIdentifier: string,
    extraParameters: Object | null
  ): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LRTGemiusPlugin');
