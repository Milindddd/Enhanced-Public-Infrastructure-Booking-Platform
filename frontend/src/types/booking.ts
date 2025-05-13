import { Facility } from './facility';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
}

export interface Booking {
    id: number;
    facility: Facility;
    userId: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: BookingStatus;
    paymentId?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
} 