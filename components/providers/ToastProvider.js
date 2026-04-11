'use client';
import { ToastContextProvider } from '@/context/ToastContext';
export default function ToastProvider({ children }) {
  return <ToastContextProvider>{children}</ToastContextProvider>;
}
