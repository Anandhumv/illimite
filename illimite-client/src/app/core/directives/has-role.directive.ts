import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/fireauth';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appHasRole]',
    standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private auth = inject(Auth);

    private allowedRoles: string[] = [];
    private authSub!: Subscription;

    @Input() set appHasRole(roles: string[]) {
        this.allowedRoles = roles;
        this.updateView();
    }

    ngOnInit() {
        // Listen to current user auth state and custom claims or roles
        this.authSub = user(this.auth).subscribe(currentUser => {
            this.updateView(currentUser);
        });
    }

    private async updateView(currentUser: any = null) {
        if (!currentUser) {
            this.viewContainer.clear();
            return;
        }

        // Fetch custom claims token from Firebase to read user role
        const idTokenResult = await currentUser.getIdTokenResult();
        const userRole = idTokenResult.claims.role || 'user'; // Defaults to standard user

        if (this.allowedRoles.includes(userRole)) {
            this.viewContainer.clear();
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    ngOnDestroy() {
        if (this.authSub) this.authSub.unsubscribe();
    }
}