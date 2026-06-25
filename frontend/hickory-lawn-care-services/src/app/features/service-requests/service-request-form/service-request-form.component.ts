import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ServiceRequestService } from "../../../core/services/service-request.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-service-request-form',
    imports: [ReactiveFormsModule], // required to use Reactive Forms
    templateUrl: './service-request-form.component.html',
    styleUrl: './service-request-form.component.css',
})
export class ServiceRequestFormComponent {
    private serviceRequestService = inject(ServiceRequestService);
    private router = inject(Router)

    successMessage = '';

    // Define the form model
    requestForm = new FormGroup({
        customerName: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        serviceType: new FormControl('', Validators.required),
        preferredDate: new FormControl('', Validators.required),
        comments: new FormControl(''),
    })

    onSubmit() {
        // 1. Validate form
        if (this.requestForm.valid) {
            const formValue = this.requestForm.value as any; // Cast to bypass strict partial types

            // 2. Call POST endpoint
            this.serviceRequestService.create({
                customerName: formValue.customerName ?? '',
                phone: formValue.phone ?? '',
                address: formValue.address ?? '',
                serviceType: formValue.serviceType ?? '',
                description: formValue.comments ?? '',
                preferredDate: formValue.preferredDate ?? ''
            }).subscribe({
                next: () => {
                    // 3. Display success message
                    this.successMessage = 'Service request created successfully!';

                    // 4. Clears request form to prevent double submission. Also visual feedback to user for a bit
                    this.requestForm.reset();

                    // 5. Navigate back to request list after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/requests']);
                    }, 2000);
                },
                error: (err) => {
                    console.error('Failed to create service request', err);
                }
            });
        } else {
            // if invalid, mark all fields as touched to display validation errors
            this.requestForm.markAllAsTouched();
        }
    }
}