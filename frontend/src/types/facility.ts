export enum FacilityType {
    SPORTS = 'SPORTS',
    CONFERENCE = 'CONFERENCE',
    MEETING = 'MEETING',
    EVENT = 'EVENT',
    OTHER = 'OTHER'
}

export interface Facility {
    id: number;
    name: string;
    type: FacilityType;
    location: string;
    description: string;
    hourlyRate: number;
    capacity: number;
    isActive: boolean;
    images?: string[];
    amenities?: string[];
    createdAt: string;
    updatedAt: string;
} 