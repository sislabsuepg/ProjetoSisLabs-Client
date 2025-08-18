import { Modal } from '@mui/material';
import React from 'react';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    nome: string;
    matricula: string;
    email: string;
    telefone: string;
    curso: string;
    periodo: string;
  };
  onChange: (field: string, value: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  onSave,
  formData,
  onChange,
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
          borderRadius: '12px',
          padding: '30px',
          width: '80%',
          maxWidth: '700px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 className="text-[1.1rem] mb-6 text-theme-blue font-semibold">
          Alterar usuário
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '25px',
          }}
          className="font-normal"
        >
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => onChange('nome', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
          <input
            type="text"
            placeholder="Matrícula"
            value={formData.matricula}
            onChange={(e) => onChange('matricula', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={(e) => onChange('telefone', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
          <input
            type="text"
            placeholder="Curso"
            value={formData.curso}
            onChange={(e) => onChange('curso', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
          <input
            type="text"
            placeholder="Período"
            value={formData.periodo}
            onChange={(e) => onChange('periodo', e.target.value)}
            className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
          />
        </div>

        <div className="flex items-center justify-between w-full gap-4">
          <button
            onClick={onClose}
            className="bg-theme-blue text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="bg-theme-green text-theme-white font-normal text-[0.9rem] h-[40px] w-full max-w-[200px] rounded-[8px]"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
