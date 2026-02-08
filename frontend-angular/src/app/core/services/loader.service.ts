import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly activeRequestCount = signal(0);
  readonly isLoading = computed(() => this.activeRequestCount() > 0);

  requestStarted(): void {
    this.activeRequestCount.update((count) => count + 1);
  }

  requestEnded(): void {
    this.activeRequestCount.update((count) => (count > 0 ? count - 1 : 0));
  }
}
