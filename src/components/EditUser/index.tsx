import { Modal, styled, Switch } from "@mui/material";

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
  const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

  // Função para decidir o tipo do input
  const getInputType = (key: string) => {
    if (key.toLowerCase().includes("email")) return "email";
    if (key.toLowerCase().includes("data")) return "date";
    switch (key.toLowerCase()) {
      case "senha":
      case "repetirSenha":
        return "password";
      case "geral":
      case "cadastro":
      case "alteracao":
      case "relatorio":
      case "advertencia":
        return "switch";
      default:
        return "text";
    }
  };

  // Ajustar datas para o formato yyyy-MM-dd (aceito pelo input type="date")
  const formatDateForInput = (val: string) => {
    if (!val) return "";
    if (val.includes("/")) {
      // dd/MM/yyyy → yyyy-MM-dd
      const [d, m, y] = val.split("/");
      return `${y}-${m}-${d}`;
    }
    return val; // já está no formato ISO
  };

  // Ajustar datas ao salvar para dd/MM/yyyy se quiser manter padrão
  const formatDateForSave = (val: string) => {
    if (!val) return "";
    if (val.includes("-")) {
      // yyyy-MM-dd → dd/MM/yyyy
      const [y, m, d] = val.split("-");
      return `${d}/${m}/${y}`;
    }
    return val;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          width: "80%",
          maxWidth: "700px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 className="text-[1.1rem] mb-6 text-theme-blue font-semibold">
          Alterar usuário
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "25px",
          }}
          className="font-normal"
        >
          {Object.keys(formData).map((key) => {
            const value = formData[key as keyof T];

            if (typeof value === "boolean") {
              return (
                <label className="flex items-center gap-4" key={key}>
                  {key}
                  <CustomSwitch
                    checked={value as boolean}
                    onChange={(e) =>
                      onChange(key as keyof T, e.target.checked as T[keyof T])
                    }
                  />
                </label>
              );
            }

            return (
              <input
                key={key}
                type={getInputType(key)}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={
                  getInputType(key) === "date"
                    ? formatDateForInput(value as string)
                    : (value as string)
                }
                onChange={(e) =>
                  onChange(
                    key as keyof T,
                    (getInputType(key) === "date"
                      ? formatDateForSave(e.target.value)
                      : e.target.value) as T[keyof T]
                  )
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
