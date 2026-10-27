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

/** Which opening hours apply on a date; the server decides, public holidays included. */
export type DayKind = "weekday" | "weekend" | "holiday";

export interface DayInfo {
  dateObj: Date;
  dayName: string;   
  dateNum: number;   
  monthName: string; 
  fullDateStr: string; 
  /** A Saturday or a Sunday. */
  isWeekend: boolean;
  kind: DayKind;
  /** The public holiday's name, when kind is "holiday". */
  holiday?: string;
}

/** Session length in minutes. */
export type SessionLength = 60 | 120;

export interface TimeSlot {
  /** The canonical label the booking API takes: "16:00 – 18:00", or "23:00 – 01:00" past midnight. */
  timeRange: string;
  /** "HH:MM", for <time dateTime>. */
  startTime: string;
  minutes: SessionLength;
  /** Minutes after the operating day's midnight. A session into the early hours has `to` past 1440. */
  from: number;
  to: number;
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
  /**
   * The price the customer was shown. When it is sent and the price has since
   * changed, the API refuses the booking instead of charging a different amount.
   */
  expectedAmount?: number;
}

/** What POST /quote asks about: the booking about to be made and who is paying. */
export interface QuotePayload {
  phoneNumber: string;
  date: string;
  timeRange: string;
  pitchType: PitchType;
}

/** What the API says a booking will cost. The server decides; this only shows it. */
export interface Quote {
  /** What will be charged, in whole KES. */
  amount: number;
  /** The standard price. */
  listPrice: number;
  /** Present only for a member, on a session the member price covers. */
  member?: MemberQuote;
}

export interface MemberQuote {
  /** The discount, as a percentage. */
  percent: number;
  /** True when this booking is the one that gets the discount. */
  applied: boolean;
  /** The month the session falls in, "2026-11". */
  month: string;
  /** 8-a-side 2 hour sessions the number has paid for in that month, not counting this one. */
  sessions: number;
  /** Which session of the month the discount is given on: the 4th. */
  discountSession: number;
  /** The month's discount has already been given (to a booking that is paid or awaiting payment). */
  discountUsed: boolean;
}

/** A started booking: the reference to follow the payment, and what is being charged. */
export interface InitiateResponse {
  reference: string;
  amount?: number;
  discount?: string;
}

export type SlotStatusMap = Record<string, BookingStatus>;
