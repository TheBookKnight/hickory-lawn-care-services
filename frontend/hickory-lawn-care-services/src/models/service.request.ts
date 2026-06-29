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
    internalNotes?: string | null;
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