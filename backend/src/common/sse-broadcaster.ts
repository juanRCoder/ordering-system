import { finalize, Observable, Subject } from 'rxjs';

export class SseBroadcaster<T> {
  private channels = new Map<string, Subject<T>>();
  private subscribers = new Map<string, number>();

  private getChannel(slug: string): Subject<T> {
    if (!this.channels.has(slug)) {
      this.channels.set(slug, new Subject<T>());
      this.subscribers.set(slug, 0);
    }
    return this.channels.get(slug)!;
  }

  next(slug: string, data: T) {
    this.getChannel(slug).next(data);
  }

  stream(slug: string): Observable<T> {
    const channel = this.getChannel(slug);
    this.subscribers.set(slug, (this.subscribers.get(slug) ?? 0) + 1);

    return channel.asObservable().pipe(
      finalize(() => {
        const count = (this.subscribers.get(slug) ?? 1) - 1;
        this.subscribers.set(slug, count);

        if (count <= 0) {
          channel.complete();
          this.channels.delete(slug);
          this.subscribers.delete(slug);
        }
      })
    );
  }
}
