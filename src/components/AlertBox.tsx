import { FaTimes } from "react-icons/fa";
import React, { useEffect } from "react";

type AlertType = "warning" | "info" | "success";

type AlertBoxProps = {
  open: boolean;
  onClose: () => void;
  message: string;
  alertType?: AlertType; // new
  timer?: boolean; // new
};

const AlertBox: React.FC<AlertBoxProps> = ({
  open,
  onClose,
  message,
  alertType = "info",
  timer = false,
}) => {
  // Auto close logic
  useEffect(() => {
    if (open && timer) {
      const timeout = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [open, timer, onClose]);

  if (!open) return null;

  // Color logic
  const textColor = {
    warning: "text-red-500",
    info: "text-black",
    success: "text-green-500",
  }[alertType];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 py-10 p-4 flex justify-center items-center overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 relative">
        {!timer && (
          <div
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full border border-white bg-black flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            <FaTimes className="text-white" />
          </div>
        )}

        {/* Message */}
        <p className={`text-sm text-center ${textColor}`}>{message}</p>
      </div>
    </div>
  );
};

export default AlertBox;
