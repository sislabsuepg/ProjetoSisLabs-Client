import { useState } from "react";
import { TextareaAutosize } from "@mui/material";
import { apiOnline } from "@/services/services";
import { toast } from "react-toastify";

export default function AdicionarRecados() {
  const [texto, setTexto] = useState("");

  const isFormValid = texto.trim().length >= 3;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("clicado");
    try {
      await apiOnline.post("/recado", { texto });
      toast.success("Recado adicionado com sucesso!");
      setTexto("");
    } catch (error: unknown) {
      const errObj = error as { response?: { data?: { erros?: string[] } } };
      if (errObj?.response?.data?.erros) {
        errObj.response.data.erros.forEach((e: string) => toast.error(e));
      } else {
        toast.error("Erro ao adicionar recado. Tente novamente.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col justify-between"
    >
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
            📝 Adicionar recados
          </p>

          <TextareaAutosize
            aria-label="maximum height"
            placeholder="Escreva o recado..."
            className="font-normal"
            value={texto}
            onChange={(e) => {
              if (e.target.value.length > 1000) {
                toast.error("O recado não pode exceder 1000 caracteres.");
                return;
              }
              setTexto(e.target.value);
            }}
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "15px",
              padding: "1rem",
              backgroundColor: "#ECECEC",
              border: "none",
              outline: "none",
            }}
          />
        </div>

        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
              ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}
