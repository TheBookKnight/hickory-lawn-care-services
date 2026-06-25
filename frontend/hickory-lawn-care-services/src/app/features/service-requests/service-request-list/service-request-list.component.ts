import { Component, inject, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ServiceRequestService } from "../../../core/services/service-request.service";


@Component({
    selector: 'app-service-request-list',
    imports: [DatePipe],
    templateUrl: './service-request-list.component.html',
    // styleUrl: './service-request-list.component.css' // TODO: Add styling later
})
export class ServiceRequestListComponent implements OnInit {
    // Inject the service
    private serviceRequestService = inject(ServiceRequestService);

    // Expose the resource to the template
    requests = this.serviceRequestService.requestsResource;

    ngOnInit() {
        // Force a reload of the service requests list when the component loads
        this.serviceRequestService.requestsResource.reload();
    }
}