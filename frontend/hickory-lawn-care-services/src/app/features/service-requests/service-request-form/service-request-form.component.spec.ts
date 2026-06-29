import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ServiceRequestFormComponent } from './service-request-form.component';
import { environment } from '../../../../environments/environment';

describe('ServiceRequestFormComponent', () => {
  let component: ServiceRequestFormComponent;
  let fixture: ComponentFixture<ServiceRequestFormComponent>;
  let httpTestingController: HttpTestingController;
  let mockRouter: any;
  const apiUrl = `${environment.apiUrl}/api/servicerequests`;

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ServiceRequestFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceRequestFormComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    // Trigger initial rendering and service instantiation
    fixture.detectChanges();

    // Flush the automatic GET request triggered by the ServiceRequestService's requestsResource
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

  it('should validate required fields', () => {
    const form = component.requestForm;
    // We already triggered detectChanges in beforeEach, form should be initialized
    expect(form.valid).toBeFalsy();

    // Verify initially required fields are invalid
    expect(form.get('customerName')?.valid).toBeFalsy();
    expect(form.get('phone')?.valid).toBeFalsy();
    expect(form.get('address')?.valid).toBeFalsy();
    expect(form.get('serviceType')?.valid).toBeFalsy();
    expect(form.get('preferredDate')?.valid).toBeFalsy();

    // Fill the fields with valid data
    form.patchValue({
      customerName: 'Alice Smith',
      phone: '555-0100',
      address: '123 Maple St',
      serviceType: 'Lawn Care',
      preferredDate: '2026-06-29T10:00:00',
    });

    expect(form.valid).toBeTruthy();
  });

  it('should have submit button disabled when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTruthy();

    // Set valid form values
    component.requestForm.patchValue({
      customerName: 'Alice Smith',
      phone: '555-0100',
      address: '123 Maple St',
      serviceType: 'Lawn Care',
      preferredDate: '2026-06-29T10:00:00',
    });
    fixture.detectChanges();

    expect(submitBtn.disabled).toBeFalsy();
  });

  it('should call create() when form is valid and submitted', async () => {
    vi.useFakeTimers();

    component.requestForm.patchValue({
      customerName: 'Alice Smith',
      phone: '555-0100',
      address: '123 Maple St',
      serviceType: 'Lawn Care',
      preferredDate: '2026-06-29T10:00:00',
      comments: 'Mow lawn',
    });
    fixture.detectChanges();

    // Submit form
    component.onSubmit();

    const req = httpTestingController.expectOne(req => req.url === apiUrl && req.method === 'POST');
    expect(req.request.body).toEqual({
      customerName: 'Alice Smith',
      phone: '555-0100',
      address: '123 Maple St',
      serviceType: 'Lawn Care',
      description: 'Mow lawn',
      preferredDate: '2026-06-29T10:00:00',
    });

    // Flush mock successful response
    req.flush({
      id: '123',
      customerName: 'Alice Smith',
      phone: '555-0100',
      address: '123 Maple St',
      serviceType: 'Lawn Care',
      description: 'Mow lawn',
      preferredDate: '2026-06-29T10:00:00',
      status: 'Pending',
      createdAt: '2026-06-29T04:00:00Z',
    });

    // Wait for async subscriptions/microtasks
    await Promise.resolve();
    fixture.detectChanges();

    expect(component.successMessage).toBe('Service request created successfully!');

    // Verify form was reset
    expect(component.requestForm.get('customerName')?.value).toBeNull();

    // Advance 2 seconds of fake-time to trigger setTimeout route navigation
    vi.advanceTimersByTime(2000);
    
    // Drain final macro-tasks and micro-tasks
    await Promise.resolve();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/requests']);
    vi.useRealTimers();
  });
});
