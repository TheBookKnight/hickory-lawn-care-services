import { Component, inject } from "@angular/core";
import { ServiceRequestService } from "../../../core/services/service-request.service";


@Component({
    selector: 'app-service-request-list',
    templateUrl: './service-request-list.component.html',
    styleUrl: './service-request-list.component.css'
})
export class ServiceRequestListComponent {
    // Inject the service
    private serviceRequestService = inject(ServiceRequestService);

    // Expose the resource to the template
    requests = this.serviceRequestService.requestsResource;
}