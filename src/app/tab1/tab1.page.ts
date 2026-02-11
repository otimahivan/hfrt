import { Component, OnInit, OnDestroy } from '@angular/core';
import { HfTransmissionService, TransmissionMetrics } from '../services/hf-transmission.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  isConnected = false;
  metrics: TransmissionMetrics | null = null;
  frequency = 100; // Hz
  serverUrl = 'ws://localhost:8080'; // Change to your server
  private destroy$ = new Subject<void>();
  showComposer = false;
  messageText = '';
  isPttActive = false;
  isScanning = false;
  channels: string[] = [];
  selectedChannel: string | null = null;
  scanResults: string[] = [];

  constructor(private hfService: HfTransmissionService) {}

  ngOnInit(): void {
    this.frequency = this.hfService.getFrequency();
    
    this.hfService.getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isConnected = status;
      });

    this.hfService.getMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.metrics = metrics;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  connect(): void {
    this.hfService.connect(this.serverUrl).subscribe({
      next: () => {
        console.log('Connected to HF transmission service');
      },
      error: (error) => {
        console.error('Connection error:', error);
      }
    });
  }

  disconnect(): void {
    this.hfService.disconnect();
  }

  updateFrequency(): void {
    this.hfService.setFrequency(this.frequency);
  }

  resetMetrics(): void {
    this.hfService.resetMetrics();
  }

  toggleComposer(): void {
    this.showComposer = !this.showComposer;
    if (!this.showComposer) {
      this.messageText = '';
    }
  }

  sendMessage(): void {
    const msg = (this.messageText || '').trim();
    if (!msg) {
      return;
    }

    // If the service exposes a sendMessage method, use it. Otherwise log.
    const svc: any = this.hfService as any;
    if (svc && typeof svc.sendMessage === 'function') {
      try {
        svc.sendMessage(msg);
      } catch (e) {
        console.error('sendMessage error', e);
      }
    } else {
      console.log('Message to send:', msg);
    }

    this.messageText = '';
    this.showComposer = false;
  }

  startPtt(): void {
    if (this.isPttActive) { return; }
    this.isPttActive = true;
    const svc: any = this.hfService as any;
    if (svc && typeof svc.startTransmit === 'function') {
      svc.startTransmit();
    } else if (svc && typeof svc.sendMessage === 'function') {
      // fallback: notify service that PTT started
      console.log('PTT start (no startTransmit): notifying via sendMessage');
    } else {
      console.log('PTT start');
    }
  }

  stopPtt(): void {
    if (!this.isPttActive) { return; }
    this.isPttActive = false;
    const svc: any = this.hfService as any;
    if (svc && typeof svc.stopTransmit === 'function') {
      svc.stopTransmit();
    } else {
      console.log('PTT stop');
    }
  }

  toggleScan(): void {
    this.isScanning = !this.isScanning;
    if (this.isScanning) {
      this.scanResults = [];
      const svc: any = this.hfService as any;
      if (svc && typeof svc.startScan === 'function') {
        svc.startScan((found: string) => {
          this.scanResults.push(found);
        });
      } else {
        // Mock scan: produce sample frequencies
        this.mockScan();
      }
    } else {
      const svc: any = this.hfService as any;
      if (svc && typeof svc.stopScan === 'function') {
        svc.stopScan();
      }
    }
  }

  mockScan(): void {
    // simple simulated scan results
    const freqs = ['3.5 MHz', '7.1 MHz', '14.2 MHz'];
    let i = 0;
    const t = setInterval(() => {
      if (!this.isScanning || i >= freqs.length) {
        clearInterval(t);
        this.isScanning = false;
        // populate channels from results
        this.channels = this.scanResults.slice();
        return;
      }
      this.scanResults.push(freqs[i++]);
    }, 600);
  }

  selectChannel(ev: any): void {
    const ch = ev && ev.detail ? ev.detail.value : ev;
    this.selectedChannel = ch;
    const svc: any = this.hfService as any;
    if (svc && typeof svc.selectChannel === 'function') {
      svc.selectChannel(ch);
    } else {
      console.log('Channel selected:', ch);
    }
  }

}
