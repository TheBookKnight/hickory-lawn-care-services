import { Routes } from '@angular/router';
import { ServiceRequestListComponent } from './features/service-requests/service-request-list/service-request-list.component';

export const routes: Routes = [
    // map the view to list of requests
    { path: 'requests', component: ServiceRequestListComponent },
    // Optional: Redirect the default empty path to your requests list
    { path: '', redirectTo: '/requests', pathMatch: 'full' }
];
