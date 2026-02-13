import type { TailSlideEvents, EventCallback } from '../types';

export class EventEmitter {
  private listeners = new Map<string, Set<EventCallback<any>>>();

  on<K extends keyof TailSlideEvents>(
    event: K,
    callback: EventCallback<TailSlideEvents[K]>,
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off<K extends keyof TailSlideEvents>(
    event: K,
    callback: EventCallback<TailSlideEvents[K]>,
  ): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit<K extends keyof TailSlideEvents>(
    event: K,
    data: TailSlideEvents[K],
  ): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  removeAll(): void {
    this.listeners.clear();
  }
}
