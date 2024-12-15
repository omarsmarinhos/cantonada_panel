import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationSoundService {

  private readonly audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.src = 'notification-sound.mp3';
    this.audio.load();
  }

  play() {
    this.audio.currentTime = 0;
    this.audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
}
