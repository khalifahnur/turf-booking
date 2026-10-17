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

/** Session length in minutes. */
export type SessionLength = 60 | 120;

export interface TimeSlot {
  timeRange: string;
  startTime: string;
  minutes: SessionLength;
}

export interface PitchOption {
  type: PitchType;
  label: string;
  maxPlayers: number;
  pitchSize: string;
}

/** One row from GET /bookings: a place on the pitch that is taken or held. */
export interface BookingRecord {
  date: string;
  pitchType: string;
  status: string;
  time: string;
}

export interface BookingFormData {
  userName: string;
  //teamName: string;
  email:string;
  phoneNumber: string;
}

export interface BookingPayload extends BookingFormData {
  date: string;
  timeRange: string;
  pitchType: PitchType;
}

export type SlotStatusMap = Record<string, BookingStatus>;
