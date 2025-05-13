import api from './api';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (email: string, password: string, name: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', { email, password, name });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        return decoded.exp ? decoded.exp * 1000 > Date.now() : false;
    } catch (error) {
        return false;
    }
}; 