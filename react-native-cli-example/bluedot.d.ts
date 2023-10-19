declare module 'bluedot-react-native' {
  import {EmitterSubscription} from 'react-native';

  type SuccessCallback = () => void;
  type FailCallback = (error: Error) => void;
  type EventCallback = (...args: any[]) => void;

  export function on(
    eventName: string,
    callback: EventCallback,
  ): EmitterSubscription;
  export function unsubscribe(eventName: string): void;
  export function unsubscribeAll(): void;
  export function setCustomEventMetaData(
    eventMetaData: Record<string, any>,
  ): void;
  export function setNotificationIdResourceId(resourceId: string): void;
  export function getInstallRef(): Promise<string>;
  export function initialize(
    projectId: string,
    onSuccessCallback?: SuccessCallback,
    onFailCallback?: FailCallback,
  ): void;
  export function isInitialized(): Promise<boolean>;
  export function reset(
    onSuccessCallback?: SuccessCallback,
    onFailCallback?: FailCallback,
  ): void;
  export function isGeoTriggeringRunning(): Promise<boolean>;
  export function stopGeoTriggering(
    onSuccessCallback?: SuccessCallback,
    onFailCallback?: FailCallback,
  ): void;
  export function isTempoRunning(): boolean;
  export function stopTempoTracking(
    onSuccessCallback?: SuccessCallback,
    onFailCallback?: FailCallback,
  ): void;
  export function getSdkVersion(): Promise<string>;
  export function getZonesAndFences(): Promise<ZoneInfo[]>;
  export function setZoneDisableByApplication(
    zoneId: string,
    disable: boolean,
  ): void;
  export function allowsBackgroundLocationUpdates(enable: boolean): void;

  export interface ZoneInfo {
    name: string;
    id: string;
    customData: Record<string, unknown>;
  }

  export class GeoTriggeringBuilder {
    constructor();
    androidNotification: (
      channelId?: string,
      channelName?: string,
      title?: string,
      content?: string,
      id?: number,
    ) => GeoTriggeringBuilder;
    iOSAppRestartNotification: (title: string, buttonText: string) => E;
    start: (onSuccess: () => void, onError: (error: Error) => void) => void;
    setCircularRegion: (
      latitude: number,
      longitude: number,
      radius: number,
    ) => GeoTriggeringBuilder;
  }

  export class TempoBuilder {
    constructor();
    androidNotification: (
      channelId?: string,
      channelName?: string,
      title?: string,
      content?: string,
      id?: number,
    ) => TempoBuilder;
    start: (
      destinationId: string,
      onSuccess: () => void,
      onError: (error: Error) => void,
    ) => void;
  }
}
