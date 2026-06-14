import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class VotingWebSocketService {
  private socket$: WebSocketSubject<any> | null = null;

  connect(roomId: string): Observable<any> {
    this.socket$ = webSocket({
      url: `ws://localhost:8080/ws/voting/${roomId}`,
    });
    return this.socket$.asObservable();
  }

  send(message: any): void {
    this.socket$?.next(message);
  }

  disconnect(): void {
    this.socket$?.complete();
  }
}
