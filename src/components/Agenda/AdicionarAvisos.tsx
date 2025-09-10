import { useState } from "react";
import { TextareaAutosize } from "@mui/material";

export default function AdicionarAvisos() {
  const [texto, setTexto] = useState("");

  const isFormValid = texto.trim().length >= 3;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
          📝 Adicionar avisos
        </p>

        <TextareaAutosize
          aria-label="maximum height"
          placeholder="Escreva o aviso..."
          className="font-normal"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          style={{ 
            width: '100%', 
            height: '200px', 
            borderRadius: '15px', 
            padding: '1rem', 
            backgroundColor: '#ECECEC', 
            border: 'none',
            outline: 'none'
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
  );
}
