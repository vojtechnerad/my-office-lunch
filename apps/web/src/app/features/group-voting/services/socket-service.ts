import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket?: Socket;

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

  emit(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      const handler = (data: T) => observer.next(data);

      this.socket?.on(event, handler);

      return () => {
        this.socket?.off(event, handler);
      };
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}
