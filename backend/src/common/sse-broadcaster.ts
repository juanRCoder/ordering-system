import { Observable, Subject } from 'rxjs';

export class SseBroadcaster<T> {
  private channels = new Map<string, Subject<T>>();

  private getChannel(slug: string): Subject<T> {
    if (!this.channels.has(slug)) {
      this.channels.set(slug, new Subject<T>());
    }
    return this.channels.get(slug)!;
  }

  // envia cada cambio
  next(slug: string, data: T) {
    this.getChannel(slug).next(data);
  }

  // observa cada cambio
  stream(slug: string): Observable<T> {
    return this.getChannel(slug).asObservable();
  }
}
