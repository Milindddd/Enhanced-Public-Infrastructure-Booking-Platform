export interface Facility {
  id: string;
  name: string;
  type: 'HALL' | 'PARK' | 'CREMATORIUM' | 'GUEST_HOUSE' | 'STADIUM';
  description: string;
  capacity?: number;
  pricePerHour: number;
  availableSlots: TimeSlot[];
  images: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  facilityId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
} 