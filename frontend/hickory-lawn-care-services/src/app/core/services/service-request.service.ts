import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { httpResource } from "@angular/common/http";
// instructions recommend below?
// import { httpResource } from '@angular/core/rxjs-interop';
import { ServiceRequest } from "../../../models/service.request";

@Injectable({
    providedIn: 'root'
})
export class ServiceRequestService {
    private readonly apiUrl = `${environment.apiUrl}/api/servicerequests`;

    // Use httpResource to GET request to fetch the array of requests
    // TODO: Is Axios better?
    requestsResource = httpResource<ServiceRequest[]>(() => this.apiUrl)
}