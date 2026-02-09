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

}
