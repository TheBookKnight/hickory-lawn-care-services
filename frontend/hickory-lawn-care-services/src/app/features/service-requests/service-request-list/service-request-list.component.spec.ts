import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceRequestListComponent } from './service-request-list.component';
import { ServiceRequestService } from '../../../core/services/service-request.service';
import { environment } from '../../../../environments/environment';
import { ServiceRequest } from '../../../../models/service.request';

describe('ServiceRequestListComponent', () => {
  let component: ServiceRequestListComponent;
  let fixture: ComponentFixture<ServiceRequestListComponent>;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/servicerequests`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceRequestListComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create successfully', () => {
    fixture.detectChanges();
    // Flush initial requests to clean up http controller queue
    const reqs = httpTestingController.match(apiUrl);
    reqs.forEach(req => {
      if (!req.cancelled) {
        req.flush([]);
      }
    });
    expect(component).toBeTruthy();
  });

  it('should call ServiceRequestService on initialization', () => {
    fixture.detectChanges();
    const reqs = httpTestingController.match(apiUrl);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    expect(reqs[0].request.method).toBe('GET');
    
    // Clean up
    reqs.forEach(req => {
      if (!req.cancelled) {
        req.flush([]);
      }
    });
  });

  it('should display returned service requests', async () => {
    const mockRequests: ServiceRequest[] = [
      {
        id: '1',
        customerName: 'Alice Smith',
        phone: '555-0100',
        address: '123 Maple St',
        serviceType: 'Lawn Mowing',
        description: 'Mow the front yard lawn',
        preferredDate: '2026-06-22T09:00:00',
        status: 'Pending',
        createdAt: '2026-06-21T10:00:00',
      },
    ];

    fixture.detectChanges();

    const reqs = httpTestingController.match(apiUrl);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    reqs.forEach(req => {
      if (!req.cancelled) {
        req.flush(mockRequests);
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Alice Smith');
    expect(rows[0].textContent).toContain('Lawn Mowing');
  });

  it('should display empty state when no requests exist', async () => {
    fixture.detectChanges();

    const reqs = httpTestingController.match(apiUrl);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    reqs.forEach(req => {
      if (!req.cancelled) {
        req.flush([]);
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No service requests found.');
  });

  it('should display error message when API call fails', async () => {
    fixture.detectChanges();

    const reqs = httpTestingController.match(apiUrl);
    expect(reqs.length).toBeGreaterThanOrEqual(1);
    reqs.forEach(req => {
      if (!req.cancelled) {
        req.flush('Error loading requests', { status: 500, statusText: 'Internal Server Error' });
      }
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage?.textContent).toContain('Failed to load service requests');
  });
});
