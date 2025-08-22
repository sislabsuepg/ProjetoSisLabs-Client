import { Modal } from '@mui/material';

interface EditUserModalProps<T extends object> {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: T;
  onChange: <K extends keyof T>(field: K, value: T[K]) => void;
}

function EditUserModal<T extends object>({
  open,
  onClose,
  onSave,
  formData,
  onChange,
}: EditUserModalProps<T>) {
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
          {Object.keys(formData).map((key) => {
            const value = formData[key as keyof T];
            return typeof value === 'boolean' ? (
              <label key={key}>
                {key}
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) =>
                    onChange(key as keyof T, e.target.checked as T[keyof T])
                  }
                />
              </label>
            ) : (
              <input
                key={key}
                type={key.includes('email') ? 'email' : 'text'}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value as string}
                onChange={(e) =>
                  onChange(key as keyof T, e.target.value as T[keyof T])
                }
                className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
              />
            );
          })}
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
}

export default EditUserModal;
