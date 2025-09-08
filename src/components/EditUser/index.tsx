import { IPermissao } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { Modal, styled, Switch } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

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
  const [options, setOptions] = useState<IPermissao[]>([]);

  // Detecta se o formData parece ser um usuário (existem campos típicos de usuário)
  const isUserForm = useMemo(() => {
    const f = formData as unknown as Record<string, unknown> | null;
    return !!(
      f &&
      ("permissaoUsuario" in f || "idPermissao" in f || "login" in f)
    );
  }, [formData]);

  useEffect(() => {
    if (!isUserForm) return; // só carrega quando for form de usuário

    const fetchPermissions = async () => {
      try {
        const resp = await apiOnline.get("/permissao");
        // tenta extrair data com tipagem segura
        const typedResp = resp as { data?: IPermissao[] } | undefined;
        const data = typedResp?.data;
        setOptions(data ?? []);
        console.log("Permissões carregadas:", data);
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    };

    fetchPermissions();
  }, [isUserForm]);

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
      case "curso":
      case "laboratorio":
      case "professor":
      case "aluno":
        return "disabledtext";
      case "permissaousuario":
        return "select";
      case "ra":
      case "login":
        return "readonlytext";
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

            if (key.toLowerCase().includes("id")) {
              return null; // Não renderiza campos que contenham "id"
            }

            if (getInputType(key) === "disabledtext") {
              return (
                <input
                  key={key}
                  type="text"
                  disabled
                  readOnly
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={
                    typeof value === "object" && value !== null
                      ? (value as Record<string, unknown>)?.nome?.toString() ??
                        ""
                      : (String(value ?? "") as string)
                  }
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                />
              );
            }

            if (getInputType(key) === "select") {
              // Se o campo for um objeto (por exemplo permissaoUsuario) usamos o id do objeto
              const selectedId = (() => {
                if (value && typeof value === "object") {
                  const v = value as Record<string, unknown>;
                  return typeof v.id === "number" ? v.id : Number(v.id ?? NaN);
                }
                return typeof value === "number" ? value : Number(value ?? NaN);
              })();

              return (
                <select
                  key={key}
                  value={selectedId ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const selected = options.find((o) => o.id === id) as
                      | IPermissao
                      | undefined;

                    // Se o campo atual contém um objeto de permissão, passamos o objeto
                    if (value && typeof value === "object") {
                      onChange(
                        key as keyof T,
                        selected as unknown as T[keyof T]
                      );
                    } else {
                      // caso o campo seja apenas o id (ex: idPermissao) passamos o número
                      onChange(key as keyof T, id as unknown as T[keyof T]);
                    }
                  }}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                >
                  <option value="">Selecione...</option>
                  {options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.nomePermissao}
                    </option>
                  ))}
                </select>
              );
            }

            if (getInputType(key) === "readonlytext") {
              return (
                <input
                  key={key}
                  type="text"
                  readOnly
                  disabled
                  value={
                    typeof value === "object" && value !== null
                      ? (value as Record<string, unknown>)?.nome?.toString() ??
                        ""
                      : (String(value ?? "") as string)
                  }
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md bg-theme-inputBg"
                />
              );
            }

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
