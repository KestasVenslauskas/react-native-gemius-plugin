import NativeLRTGemiusPlugin, {
  type GemiusParams,
} from './NativeLRTGemiusPlugin';

const PROGRAM_TYPE_VIDEO = 'video';
const PROGRAM_TYPE_AUDIO = 'audio';

/**
 * Duration used for live streams
 */
export const DURATION_LIVE_STREAM = -1;

export { type GemiusParams };

export default class Gemius {
  static setAppInfo(
    app: string,
    version: string,
    gemiusHitCollectorHost: string,
    gemiusPrismIdentifier: string
  ): void {
    NativeLRTGemiusPlugin.setAppInfo(
      app,
      version,
      gemiusHitCollectorHost,
      gemiusPrismIdentifier
    );
  }

  static setPlayerInfo(
    playerId: string,
    serverHost: string,
    accountId: string
  ): void {
    NativeLRTGemiusPlugin.setPlayerInfo(playerId, serverHost, accountId);
  }

  static setProgramData(
    clipId: string,
    name: string,
    duration: number,
    isVideo: boolean
  ): void {
    const type = isVideo === true ? PROGRAM_TYPE_VIDEO : PROGRAM_TYPE_AUDIO;
    NativeLRTGemiusPlugin.setProgramData(clipId, name, duration, type);
  }

  static sendPlay(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendPlay(clipId, offset);
  }

  static sendPause(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendPause(clipId, offset);
  }

  static sendBuffer(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendBuffer(clipId, offset);
  }

  static sendStop(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendStop(clipId, offset);
  }

  static sendComplete(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendComplete(clipId, offset);
  }

  static sendClose(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendClose(clipId, offset);
  }

  static sendSeek(clipId: string, offset: number): void {
    NativeLRTGemiusPlugin.sendSeek(clipId, offset);
  }

  static sendPartialPageViewedEvent(
    gemiusPrismIdentifier: string,
    extraParameters: GemiusParams | null = null
  ): void {
    NativeLRTGemiusPlugin.sendPartialPageViewedEvent(
      gemiusPrismIdentifier,
      extraParameters
    );
  }

  static sendPageViewedEvent(
    gemiusPrismIdentifier: string,
    extraParameters: GemiusParams | null = null
  ): void {
    NativeLRTGemiusPlugin.sendPageViewedEvent(
      gemiusPrismIdentifier,
      extraParameters
    );
  }

  static sendActionEvent(
    gemiusPrismIdentifier: string,
    extraParameters: GemiusParams | null = null
  ): void {
    NativeLRTGemiusPlugin.sendActionEvent(
      gemiusPrismIdentifier,
      extraParameters
    );
  }
}
