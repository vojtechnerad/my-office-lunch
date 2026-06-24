import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import {
  WebSocketClientToServerEvents,
  WebSocketServerToClientEvents,
} from 'contracts/websockets.contracts';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket?: Socket<
    WebSocketServerToClientEvents,
    WebSocketClientToServerEvents
  >;

  public connect(jwtToken: string): void {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: jwtToken,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected', this.socket?.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });
  }

  emit<EventName extends keyof WebSocketClientToServerEvents>(
    event: EventName,
    ...args: Parameters<WebSocketClientToServerEvents[EventName]>
  ): void {
    this.socket?.emit(event, ...args);
  }

  on<EventName extends keyof WebSocketServerToClientEvents>(
    event: EventName,
  ): Observable<Parameters<WebSocketServerToClientEvents[EventName]>[0]> {
    return new Observable((observer) => {
      const handler = ((
        data: Parameters<WebSocketServerToClientEvents[EventName]>[0],
      ) => observer.next(data)) as WebSocketServerToClientEvents[EventName];

      this.socket?.on(event, handler as never);

      return () => {
        this.socket?.off(event, handler as never);
      };
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}
