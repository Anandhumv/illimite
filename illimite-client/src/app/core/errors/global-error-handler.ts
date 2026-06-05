import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    // Injector is used to lazily load NotificationService to avoid circular dependency issues
    private injector = inject(Injector);

    handleError(error: any): void {
        const notificationService = this.injector.get(NotificationService);

        // Extract a readable error message
        const message = error.message ? error.message : error.toString();

        console.error('Captured by Global Error Handler:', error);

        // Alert the user gracefully via UI Notification
        notificationService.show(
            `An unexpected error occurred: ${message.slice(0, 60)}...`,
            'error'
        );
    }
}