import api from './api';
import { Facility } from '../types/facility';

export const getAllFacilities = async (): Promise<Facility[]> => {
    const response = await api.get<Facility[]>('/facilities');
    return response.data;
};

export const getFacilityById = async (id: number): Promise<Facility> => {
    const response = await api.get<Facility>(`/facilities/${id}`);
    return response.data;
};

export const createFacility = async (facility: Partial<Facility>): Promise<Facility> => {
    const response = await api.post<Facility>('/facilities', facility);
    return response.data;
};

export const updateFacility = async (id: number, facility: Partial<Facility>): Promise<Facility> => {
    const response = await api.put<Facility>(`/facilities/${id}`, facility);
    return response.data;
};

export const deleteFacility = async (id: number): Promise<void> => {
    await api.delete(`/facilities/${id}`);
};

export const getFacilitiesByType = async (type: string): Promise<Facility[]> => {
    const response = await api.get<Facility[]>(`/facilities/type/${type}`);
    return response.data;
};

export const searchFacilities = async (query: string): Promise<Facility[]> => {
    const response = await api.get<Facility[]>('/facilities/search', {
        params: { query }
    });
    return response.data;
}; 