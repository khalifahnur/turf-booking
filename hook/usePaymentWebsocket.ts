import { PaymentStatus, PaymentWSMessage } from '@/lib/payment';
import { useState, useEffect, useRef } from 'react';


export const usePaymentWebSocket = (reference: string | null) => {
  const [status, setStatus] = useState<PaymentStatus>('Idle');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!reference) return;

    setStatus('Connecting');

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';
    
    ws.current = new WebSocket(`${wsUrl}/ws/v1/payment-status?reference=${reference}`);

    ws.current.onopen = () => {
    //   console.log('WebSocket Connected');
      setStatus('Pending');
    };

    ws.current.onmessage = (event) => {
      try {
        const data: PaymentWSMessage = JSON.parse(event.data);
        // console.log('Received WebSocket Message:', data);
        
        if (data.status === 'Completed') {
          setStatus('Completed');
          ws.current?.close(); 
        }
      } catch (error) {
        console.error('Error parsing WebSocket message');
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setStatus('Failed');
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [reference]);

  return { status };
};