import { Component, input, output, signal, linkedSignal, inject } from '@angular/core';
import { form, FormField, maxLength } from '@angular/forms/signals'
import { ServiceRequest } from '../../../../models/service.request';
import { ServiceRequestService } from '../../../core/services/service-request.service';

@Component({
    selector: 'app-service-request-review-modal',
    imports: [FormField],
    templateUrl: './service-request-review-modal.component.html',
    styleUrl: './service-request-review-modal.component.css'
})
export class ServiceRequestReviewModalComponent {
    // Inject the service
    private serviceRequestService = inject(ServiceRequestService);

    // INPUT: demand the parent provides a ServiceRequest object
    request = input.required<ServiceRequest>();

    // OUTPUT: We define a custom event to tell the parent we want to close
    closeModal = output<void>();

    // OUTPUT: Notify parent component when a request is successfully updated
    requestUpdated = output<ServiceRequest>();

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

    isSaveDisabled(): boolean {
        const descLen = this.updateModel().description?.length ?? 0;
        const notesLen = this.updateModel().internalNotes?.length ?? 0;
        const isInvalid = descLen > 250 || notesLen > 500;
        
        if (isInvalid) return true;

        const isUnchanged = this.updateModel().status === this.request().status &&
                            this.updateModel().description === this.request().description &&
                            (this.updateModel().internalNotes || '') === (this.request().internalNotes || '');
        
        return isUnchanged;
    }

    onClose() {
        // Fire the custom event
        this.closeModal.emit();
    }

    onSave() {
        this.serviceRequestService.update(this.request().id, this.updateModel()).subscribe({
            next: (updated) => {
                console.log('Successfully saved:', updated);
                this.requestUpdated.emit(updated);
                this.isEditing.set(false);
            },
            error: (err) => {
                console.error('Failed to save service request', err);
            }
        });
    }
}