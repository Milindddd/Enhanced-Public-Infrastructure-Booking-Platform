import api from './api';
import { Booking, BookingStatus } from '../types/booking';

export const createBooking = async (booking: Partial<Booking>): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
};

export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/bookings/user/${userId}`);
    return response.data;
};

export const getBookingsByFacilityId = async (facilityId: number): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/bookings/facility/${facilityId}`);
    return response.data;
};

export const getBookingById = async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
};

export const updateBookingStatus = async (id: number, status: BookingStatus): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
};

export const cancelBooking = async (id: number, reason: string): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`, { reason });
    return response.data;
};

export const confirmBooking = async (id: number, paymentId: string): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/confirm`, { paymentId });
    return response.data;
};

export const checkSlotAvailability = async (
    facilityId: number,
    startTime: string,
    endTime: string
): Promise<boolean> => {
    const response = await api.get<boolean>('/bookings/check-availability', {
        params: { facilityId, startTime, endTime }
    });
    return response.data;
}; 