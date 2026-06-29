import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, httpResource } from "@angular/common/http";
// instructions recommend below?
// import { httpResource } from '@angular/core/rxjs-interop';
import { CreateServiceRequest, ServiceRequest } from "../../../models/service.request";

@Injectable({
    providedIn: 'root'
})
export class ServiceRequestService {
    private readonly apiUrl = `${environment.apiUrl}/api/servicerequests`;

    // Inject HttpClient for our POST request
    private http = inject(HttpClient);

    // Use httpResource to GET request to fetch the array of requests
    // TODO: Is Axios better?
    requestsResource = httpResource<ServiceRequest[]>(() => this.apiUrl);

    // method to create a request
    create(request: CreateServiceRequest) {
        return this.http.post<ServiceRequest>(this.apiUrl, request);
    }

    // method to update a request
    update(id: string | number, request: Partial<ServiceRequest>) {
        return this.http.put<ServiceRequest>(`${this.apiUrl}/${id}`, request);
    }
}