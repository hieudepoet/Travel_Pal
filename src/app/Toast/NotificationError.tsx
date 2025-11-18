"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

type NotificationErrorProps = {
  /** The error text that will be shown in the notification */
  message: string;
  /** An optional callback fired when the toast is dismissed */
  onClose?: () => void;
  /** Auto-dismiss duration in milliseconds. Set to null to keep it open */
  duration?: number | null;
  /** Control visibility from parent if needed */
  isOpen?: boolean;
};

const NotificationError = ({
  message,
  onClose,
  duration = 2000,
  isOpen = true,
}: NotificationErrorProps) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen, message]);

  useEffect(() => {
    if (!visible || duration === null) return;

    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, visible, message]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed left-1/2 top-10 z-50 flex max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl text-sm p-[10px]"
      style={{
        animation: "slide-in 250ms ease-out",
        background: '#fff',
        border: '4px solid red',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        color: "red",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span className="rounded-full bg-red-100 p-2 text-red-600">
        <AlertCircle className="h-4 w-4" aria-hidden />
      </span>
      <div className="flex-1">
        <p className="font-semibold">Có lỗi xảy ra</p>
        <p className="mt-1 text-sm font-semibold" style={{ color: '#b20f03' }}>{message}</p>
      </div>
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationError;
