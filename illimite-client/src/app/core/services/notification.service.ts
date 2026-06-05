import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private toasts$ = new BehaviorSubject<ToastMessage[]>([]);
    readonly toasts = this.toasts$.asObservable();
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
        const id = this.counter++;
        const currentToasts = this.toasts$.value;

        this.toasts$.next([...currentToasts, { id, message, type }]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    remove(id: number) {
        const updatedToasts = this.toasts$.value.filter((t) => t.id !== id);
        this.toasts$.next(updatedToasts);
    }
}