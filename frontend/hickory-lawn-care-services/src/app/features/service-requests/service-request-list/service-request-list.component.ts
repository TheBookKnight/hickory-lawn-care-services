import { Component, inject, OnInit, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ServiceRequestService } from "../../../core/services/service-request.service";
import { ServiceRequest } from '../../../../models/service.request';
import { ServiceRequestReviewModalComponent } from "../service-request-detail/service-request-review-modal.component";

@Component({
    selector: 'app-service-request-list',
    imports: [DatePipe, ServiceRequestReviewModalComponent],
    templateUrl: './service-request-list.component.html',
    styleUrl: './service-request-list.component.css'
})
export class ServiceRequestListComponent implements OnInit {
    // Inject the service
    private serviceRequestService = inject(ServiceRequestService);

    // Expose the resource to the template
    requests = this.serviceRequestService.requestsResource;

    // A writable signal to track the currently selected request
    selectedRequest = signal<ServiceRequest | null>(null);

    // method to set the signal when a row is clicked
    openModal(request: ServiceRequest) {
        this.selectedRequest.set(request);
    }

    // method to clear the signal when the modal emits 'closeModal'
    closeModal() {
        this.selectedRequest.set(null);
    }

    ngOnInit() {
        // Force a reload of the service requests list when the component loads
        this.serviceRequestService.requestsResource.reload();
    }
}