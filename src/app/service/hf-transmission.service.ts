import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HfTransmissionService {
  private connectionStatus = new Subject<boolean>();
  private metrics = new Subject<any>();

  constructor() { }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  getMetrics(): Observable<any> {
    return this.metrics.asObservable();
  }

  connect(url: string): Observable<any> {
    // Add your connection logic here
    this.connectionStatus.next(true);
    return new Observable();
  }

  disconnect(): void {
    // Add your disconnection logic here
    this.connectionStatus.next(false);
  }

  setFrequency(freq: number): void {
    // Add your frequency logic here
    console.log('Frequency set:', freq);
  }

  resetMetrics(): void {
    // Add your reset logic here
    this.metrics.next(null);
  }

  // Add other methods (sendMessage, startTransmit, etc.) as needed
}


Do you want to add specific methods (like sendMessage, startTransmit) to this service? 😊
[14:38, 2/11/2026] OtimahWa: yes
👉 Let's add some common methods.

Update hf-transmission.service.ts with these additions:


import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HfTransmissionService {
  private connectionStatus = new Subject<boolean>();
  private metrics = new Subject<any>();

  constructor() { }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  getMetrics(): Observable<any> {
    return this.metrics.asObservable();
  }

  connect(url: string): Observable<any> {
    // Add your connection logic here
    this.connectionStatus.next(true);
    return new Observable();
  }

  disconnect(): void {
    // Add your disconnection logic here
    this.connectionStatus.next(false);
  }

  setFrequency(freq: number): void {
    // Add your frequency logic here
    console.log('Frequency set:', freq);
  }

  resetMetrics(): void {
    // Add your reset logic here
    this.metrics.next(null);
  }

  sendMessage(msg: string): void {
    console.log('Sending message:', msg);
    // Add your message sending logic here
  }

  startTransmit(): void {
    console.log('Start transmit');
    // Add your transmit logic here
  }

  stopTransmit(): void {
    console.log('Stop transmit');
    // Add your stop transmit logic here
  }

  startScan(callback: (freq: string) => void): void {
    console.log('Start scanning');
    // Add your scan logic here
    // Example mock scan:
    const freqs = ['3.5 MHz', '7.1 MHz', '14.2 MHz'];
    freqs.forEach(f => callback(f));
  }

  stopScan(): void {
    console.log('Stop scanning');
    // Add your stop scan logic here
  }

  selectChannel(channel: string): void {
    console.log('Channel selected:', channel);
    // Add your channel selection logic here
  }
}