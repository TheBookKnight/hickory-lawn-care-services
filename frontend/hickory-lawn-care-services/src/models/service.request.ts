/**
 * ServiceRequest shape.
 */

export interface ServiceRequest {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    serviceType: string;
    description: string;
    preferredDate: string;
    status: string;
    createdAt: string; // TODO: consider using Date object
}

/**
 * CreateServiceRequest payload.
 */
export interface CreateServiceRequest {
    customerName: string;
    phone: string;
    address: string;
    serviceType: string;
    description: string;
    preferredDate: string;
}