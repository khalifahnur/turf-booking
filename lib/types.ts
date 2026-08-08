// export type TimeSlot = {
//   id: string;
//   day: string;
//   dayIndex: number;
//   startTime: string;
//   endTime: string;
//   isAvailable: boolean;
//   isBooked: boolean;
// };

// export type Booking = {
//   id: string;
//   slotId: string;
//   pitchType: PitchType;
//   teamName: string;
//   contactName: string;
//   phoneNumber: string;
//   day: string;
//   startTime: string;
//   endTime: string;
//   bookingDate: string;
//   paymentStatus: 'pending' | 'completed' | 'failed';
// };

// export type PitchType = '5aside' | '8aside';

// export type BookingFormData = {
//   pitchType: PitchType;
//   teamName: string;
//   contactName: string;
//   phoneNumber: string;
// };


export type PitchType = "5Aside" | "8Aside";
export type BookingStatus = "Pending" | "Confirmed" | "Booked" | "Failed";

export interface DayInfo {
  dateObj: Date;
  dayName: string;   
  dateNum: number;   
  monthName: string; 
  fullDateStr: string; 
  isWeekend: boolean;
}

export interface TimeSlot {
  timeRange: string;  
  startTime: string;  
}

export interface PitchOption {
  type: PitchType;
  label: string;     
  price: number;     
  maxPlayers: number;
  pitchSize: string; 
}

export interface BookingFormData {
  userName: string;
  teamName: string;
  //email:string;
  phoneNumber: string;
}

export interface BookingPayload extends BookingFormData {
  date: string;
  timeRange: string;
  pitchType: PitchType;
}

export type SlotStatusMap = Record<string, BookingStatus>;
