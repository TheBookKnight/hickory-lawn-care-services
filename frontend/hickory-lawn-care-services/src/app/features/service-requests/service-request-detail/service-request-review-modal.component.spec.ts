import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceRequestReviewModalComponent } from './service-request-review-modal.component';
import { ServiceRequestService } from '../../../core/services/service-request.service';
import { environment } from '../../../../environments/environment';
import { ServiceRequest } from '../../../../models/service.request';

describe('ServiceRequestReviewModalComponent', () => {
  let component: ServiceRequestReviewModalComponent;
  let fixture: ComponentFixture<ServiceRequestReviewModalComponent>;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/servicerequests`;

  const mockRequest: ServiceRequest = {
    id: '123',
    customerName: 'Alice Smith',
    phone: '555-0100',
    address: '123 Maple St',
    serviceType: 'Lawn Mowing',
    description: 'Mow lawn',
    preferredDate: '2026-06-29T10:00:00Z',
    status: 'Pending',
    internalNotes: 'Initial notes',
    createdAt: '2026-06-29T10:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestReviewModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceRequestReviewModalComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    // Set the required input before running detectChanges
    fixture.componentRef.setInput('request', mockRequest);
    fixture.detectChanges();

    // Flush the eager GET to /api/servicerequests from ServiceRequestService requestsResource
    const reqs = httpTestingController.match(apiUrl);
    reqs.forEach(req => {
      if (!req.cancelled && req.request.method === 'GET') {
        req.flush([]);
      }
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should display request details in read-only mode by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alice Smith');
    expect(compiled.textContent).toContain('Lawn Mowing');
    expect(compiled.textContent).toContain('Pending');
    expect(compiled.textContent).toContain('Initial notes');

    // Should not show form fields initially
    expect(compiled.querySelector('select')).toBeNull();
    expect(compiled.querySelector('textarea')).toBeNull();
  });

  it('should toggle edit mode and populate form fields', () => {
    component.toggleEdit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.isEditing()).toBeTruthy();

    const select = compiled.querySelector('select') as HTMLSelectElement;
    const textareas = compiled.querySelectorAll('textarea');

    expect(select).toBeTruthy();
    expect(textareas.length).toBe(2);

    expect(component.updateModel().status).toBe('Pending');
    expect(component.updateModel().description).toBe('Mow lawn');
    expect(component.updateModel().internalNotes).toBe('Initial notes');
  });

  it('should emit closeModal output when close is clicked', () => {
    let closed = false;
    component.closeModal.subscribe(() => {
      closed = true;
    });

    component.onClose();
    expect(closed).toBeTruthy();
  });

  it('should disable Save button until changes are made', () => {
    component.toggleEdit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const saveBtn = compiled.querySelector('button.btn-primary') as HTMLButtonElement;
    expect(saveBtn.disabled).toBeTruthy();

    // Update status to mark the form dirty/changed
    component.updateModel.set({
      status: 'completed',
      description: 'Mow lawn',
      internalNotes: 'Initial notes'
    });
    fixture.detectChanges();

    expect(saveBtn.disabled).toBeFalsy();
  });

  it('should call update() and emit requestUpdated on save', async () => {
    component.toggleEdit();
    fixture.detectChanges();

    let updatedRequest: ServiceRequest | null = null;
    component.requestUpdated.subscribe(req => {
      updatedRequest = req;
    });

    // Make a modification to status and description
    component.updateModel.set({
      status: 'completed',
      description: 'Mow lawn and trim hedges',
      internalNotes: 'Initial notes'
    });
    fixture.detectChanges();

    component.onSave();

    const req = httpTestingController.expectOne(`${apiUrl}/123`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      status: 'completed',
      description: 'Mow lawn and trim hedges',
      internalNotes: 'Initial notes',
    });

    const returnedResponse = {
      ...mockRequest,
      status: 'completed',
      description: 'Mow lawn and trim hedges',
    };

    req.flush(returnedResponse);

    await Promise.resolve();
    fixture.detectChanges();

    expect(updatedRequest).toEqual(returnedResponse);
    expect(component.isEditing()).toBeFalsy();
  });
});
