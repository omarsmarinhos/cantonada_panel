import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private readonly socket: Socket;

  constructor() {
    this.socket = io(environment.wsUrl, {
      withCredentials: true
    });
  }

  onNewOrder(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('newOrder', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
