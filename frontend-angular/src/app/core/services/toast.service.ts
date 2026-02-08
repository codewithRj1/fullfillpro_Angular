import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);
  private toastIdCounter = 0;

  success(message: string, durationMs = 3000): void {
    this.push('success', message, durationMs);
  }

  error(message: string, durationMs = 4500): void {
    this.push('error', message, durationMs);
  }

  info(message: string, durationMs = 3000): void {
    this.push('info', message, durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((messages) => messages.filter((item) => item.id !== id));
  }

  private push(type: ToastType, message: string, durationMs: number): void {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const id = ++this.toastIdCounter;
    const toast: ToastMessage = { id, type, message: trimmedMessage, durationMs };
    this.toasts.update((messages) => [...messages, toast]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
