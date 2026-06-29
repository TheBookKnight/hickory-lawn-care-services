import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceRequestService } from './service-request.service';
import { environment } from '../../../environments/environment';
import { CreateServiceRequest, ServiceRequest } from '../../../models/service.request';

describe('ServiceRequestService', () => {
  let service: ServiceRequestService;
  let httpTestingController: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/servicerequests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceRequestService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ServiceRequestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve all service requests (GET)', () => {
      const mockRequests: ServiceRequest[] = [
        {
          id: '1',
          customerName: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
          serviceType: 'Lawn Care',
          description: 'Mow lawn',
          preferredDate: '2026-06-29T10:00:00Z',
          status: 'Pending',
          createdAt: '2026-06-29T00:00:00Z',
        },
      ];

      service.getAll().subscribe((requests) => {
        expect(requests).toEqual(mockRequests);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequests);
    });
  });

  describe('getById', () => {
    it('should retrieve a single service request by id (GET)', () => {
      const mockRequest: ServiceRequest = {
        id: '1',
        customerName: 'John Doe',
        phone: '123-456-7890',
        address: '123 Main St',
        serviceType: 'Lawn Care',
        description: 'Mow lawn',
        preferredDate: '2026-06-29T10:00:00Z',
        status: 'Pending',
        createdAt: '2026-06-29T00:00:00Z',
      };

      service.getById('1').subscribe((request) => {
        expect(request).toEqual(mockRequest);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRequest);
    });
  });

  describe('create', () => {
    it('should send a POST request with payload', () => {
      const newRequest: CreateServiceRequest = {
        customerName: 'Jane Doe',
        phone: '987-654-3210',
        address: '456 Elm St',
        serviceType: 'Tree Removal',
        description: 'Cut oak tree',
        preferredDate: '2026-07-01T10:00:00Z',
      };

      const createdResponse: ServiceRequest = {
        id: '2',
        ...newRequest,
        status: 'Pending',
        createdAt: '2026-06-29T01:00:00Z',
      };

      service.create(newRequest).subscribe((res) => {
        expect(res).toEqual(createdResponse);
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newRequest);
      req.flush(createdResponse);
    });
  });

  describe('update', () => {
    it('should send a PUT request with payload', () => {
      const updateData: Partial<ServiceRequest> = {
        status: 'Completed',
        description: 'Updated comments',
      };

      const updatedResponse: ServiceRequest = {
        id: '1',
        customerName: 'John Doe',
        phone: '123-456-7890',
        address: '123 Main St',
        serviceType: 'Lawn Care',
        description: 'Updated comments',
        preferredDate: '2026-06-29T10:00:00Z',
        status: 'Completed',
        createdAt: '2026-06-29T00:00:00Z',
      };

      service.update('1', updateData).subscribe((res) => {
        expect(res).toEqual(updatedResponse);
      });

      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedResponse);
    });
  });
});
