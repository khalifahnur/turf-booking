export type PaymentStatus = 'Idle' | 'Connecting' | 'Pending' | 'Completed' | 'Failed';

export interface PaymentWSMessage {
  reference: string;
  status: PaymentStatus;
}