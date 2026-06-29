import { Component, input, output, signal, linkedSignal } from '@angular/core';
import { form, FormField, maxLength } from '@angular/forms/signals'
import { ServiceRequest } from '../../../../models/service.request';

@Component({
    selector: 'app-service-request-review-modal',
    imports: [FormField],
    templateUrl: './service-request-review-modal.component.html',
    styleUrl: './service-request-review-modal.component.css'
})
export class ServiceRequestReviewModalComponent {
    // INPUT: demand the parent provides a ServiceRequest object
    request = input.required<ServiceRequest>();

    // OUTPUT: We define a custom event to tell the parent we want to close
    closeModal = output<void>();

    // Track if we are in edit mode
    isEditing = signal<boolean>(false);

    // Create a linkedSignal that copies the input data for our form
    updateModel = linkedSignal(() => ({
        status: this.request().status,
        description: this.request().description,
        internalNotes: this.request().internalNotes || ''
    }));

    // Create the Signal Form tree
    updateForm = form(this.updateModel, (s) => {
        maxLength(s.description, 250);
        maxLength(s.internalNotes, 500);
    });

    // Methods to handle button clicks
    toggleEdit() {
        this.isEditing.set(!this.isEditing());
    }

    onClose() {
        // Fire the custom event
        this.closeModal.emit();
    }

    onSave() {
        console.log('Ready to save:', this.updateModel());
        this.isEditing.set(false);
    }
}