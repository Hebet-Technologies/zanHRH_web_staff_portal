import { Injectable, OnDestroy } from '@angular/core';
import Pusher from 'pusher-js';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RealtimeEvent {
  channel: string;
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeService implements OnDestroy {
  private pusher: typeof Pusher | any = null;
  private channels: Map<string, any> = new Map();
  private userId: number | null = null;

  private eventSubject = new Subject<RealtimeEvent>();
  public events$ = this.eventSubject.asObservable();

  private notificationSubject = new Subject<any>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor() {
    this.init();
  }

  private init(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) return;

    const user = JSON.parse(userJson);
    this.userId = user.id;

    this.pusher = new Pusher(environment.reverb.key, {
      cluster: '',
      wsHost: environment.reverb.wsHost,
      wsPort: environment.reverb.wsPort,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: environment.reverb.authEndpoint,
      auth: {
        headers: {
          Authorization: token,
          Accept: 'application/json',
        },
      },
    });

    this.pusher.connection.bind('connected', () => {
      console.log('[Realtime] Connected to Reverb');
      this.subscribeToUserChannel();
    });

    this.pusher.connection.bind('error', (err: any) => {
      console.error('[Realtime] Connection error:', err);
    });

    this.events$.subscribe((evt) => {
      this.notificationSubject.next(evt);
    });
  }

  private subscribeToUserChannel(): void {
    if (!this.userId || !this.pusher) return;
    this.subscribe(`private-users.${this.userId}`);
  }

  subscribe(channelName: string): void {
    if (!this.pusher || this.channels.has(channelName)) return;

    const channel = this.pusher.subscribe(channelName);
    this.channels.set(channelName, channel);

    channel.bind_global((event: string, data: any) => {
      const cleanEvent = event.startsWith('.') ? event.substring(1) : event;
      this.eventSubject.next({ channel: channelName, event: cleanEvent, data });
    });

    console.log(`[Realtime] Subscribed to ${channelName}`);
  }

  unsubscribe(channelName: string): void {
    if (!this.pusher || !this.channels.has(channelName)) return;
    this.pusher.unsubscribe(channelName);
    this.channels.delete(channelName);
    console.log(`[Realtime] Unsubscribed from ${channelName}`);
  }

  subscribeToTicket(ticketUuid: string): void {
    this.subscribe(`private-help-desk-tickets.${ticketUuid}`);
  }

  unsubscribeFromTicket(ticketUuid: string): void {
    this.unsubscribe(`private-help-desk-tickets.${ticketUuid}`);
  }

  ngOnDestroy(): void {
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }
}