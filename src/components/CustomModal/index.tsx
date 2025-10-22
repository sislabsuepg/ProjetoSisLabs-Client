import { Modal } from '@mui/material';
import React from 'react';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.2)',
          padding: '24px',
          minWidth: '400px',
          minHeight: '300px',
          textAlign: 'center',
        }}
        className="flex items-center justify-between flex-col"
      >
        {title && <p className="text-[1.5rem] font-medium">{title}</p>}

        <p className="font-normal leading-4 text-theme-blue">{message}</p>

        <div className="flex items-center justify-between w-full gap-4">
          {onCancel && (
            <button
              className="bg-theme-red text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          {onConfirm && (
            <button
              className="bg-theme-blue text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
