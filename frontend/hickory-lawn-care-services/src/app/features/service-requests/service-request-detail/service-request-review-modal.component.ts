import { Component, input, output } from '@angular/core';
import { ServiceRequest } from '../../../../models/service.request';

@Component({
    selector: 'app-service-request-review-modal',
    templateUrl: './service-request-review-modal.component.html',
    styleUrl: './service-request-review-modal.component.css'
})
export class ServiceRequestReviewModalComponent {
    // INPUT: demand the parent provides a ServiceRequest object
    request = input.required<ServiceRequest>();

    // OUTPUT: We define a custom event to tell the parent we want to close
    closeModal = output<void>();

    onClose() {
        // Fire the custom event
        this.closeModal.emit();
    }
}