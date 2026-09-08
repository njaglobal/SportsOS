/**
 * Native/platform capability ports. These are NOT implemented in this sprint.
 * They exist to prove the architecture places platform APIs behind adapters
 * (invariant 22). Future web and native adapters implement these.
 */

export interface CameraPort {
  capturePhoto(): Promise<Blob>;
}

export interface QrScannerPort {
  scan(): Promise<string>;
}

export interface PushNotificationPort {
  register(): Promise<string>;
  send(notification: NotificationPayload): Promise<void>;
}

export interface NotificationPayload {
  readonly title: string;
  readonly body: string;
  readonly data?: Record<string, string>;
}

export interface SecureCredentialStoragePort {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface BiometricsPort {
  isAvailable(): Promise<boolean>;
  verify(reason: string): Promise<boolean>;
}

export interface FileUploadPort {
  upload(file: Blob, contentType: string): Promise<string>;
}

export interface DeepLinkPort {
  open(path: string): Promise<void>;
  onOpen(listener: (path: string) => void): void;
}

export interface SharePort {
  share(payload: { title: string; text?: string; url?: string }): Promise<void>;
}

export interface LocationPort {
  current(): Promise<{ lat: number; lng: number } | null>;
}

export interface OfflineSyncPort {
  enqueue(operation: QueuedOperation): Promise<void>;
  flush(): Promise<void>;
}

export interface QueuedOperation {
  readonly id: string;
  readonly type: string;
  readonly payload: unknown;
}
