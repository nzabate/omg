
import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from '../../environments/environment';
import { ImageReviewMessage } from '../models/message.model';

@Injectable()
export class ChatService {

  messageReceived = new EventEmitter<ImageReviewMessage>();

  private chatHub: HubConnection;

  constructor() {
    this.buildHub();
    this.registerOnServerEvent();
    this.connectHub();
  }

  joinResourceGroup(resourceId: number) {
    const group = resourceId.toString();
    this.chatHub.invoke('JoinGroup', group);
  }

  leaveResourceGroup(resourceId: number) {
    const group = resourceId.toString();
    this.chatHub.invoke('RemoveFromGroup', group);
  }

  sendMessageToResourceGroup(resourceId: number, msg: ImageReviewMessage) {
    const group = resourceId.toString();
    this.chatHub.invoke('SendMessageToGroup', group, msg);
  }

  private buildHub() {
    this.chatHub = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/chat`)
      .build();
  }

  private connectHub() {
    this.chatHub
      .start()
      .catch(err => {
        setTimeout(() => {
          this.connectHub();
        }, 5000);
      })
  }

  private registerOnServerEvent() {
    this.chatHub.on('receiveMessage', (msg: ImageReviewMessage) => {
      this.messageReceived.emit(msg);
    });
  }
}
