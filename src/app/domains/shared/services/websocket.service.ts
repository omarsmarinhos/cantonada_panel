import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

   readonly socketNewOrder: Socket;
   readonly socketChangeOrderStatus: Socket;
   socketChangeOrderStatusInit = false;

  constructor() {
    this.socketNewOrder = io(environment.socketNewOrderUrl, {
      withCredentials: true
    });
    this.socketChangeOrderStatus = io(environment.socketChangeOrderStatusUrl, {
      withCredentials: false,
    });
    this.socketChangeOrderStatus.emit('get-tienda-online', {
      'groupId': 'tiendaonline-12345696321-542',
      'iDPedido': 1,
      'iEstado': 1,
      'action': 'enviado'
    });
  }

  onNewOrder(): Observable<any> {
    return new Observable(observer => {
      this.socketNewOrder.on('newOrder', (data) => {
        observer.next(data);
      });
    });
  }

  onChangeOrderStatus(): Observable<any> {
    return new Observable(observer => {
      this.socketChangeOrderStatus.on('sendTiendaOnline', (data) => {
        observer.next(data);
      });
    });
  }

  disconnectSocketNewOrder() {
    if (this.socketNewOrder) {
      this.socketNewOrder.disconnect();
    }
  }

  disconnectSocketChangeOrderStatus() {
    if (this.socketChangeOrderStatus) {
      this.socketChangeOrderStatus.disconnect();
    }
  }
}
