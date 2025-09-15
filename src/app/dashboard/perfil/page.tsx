"use client";
import DefaultButton from "@/components/DefaultButton";
import PersonIcon from "@mui/icons-material/Person";
import { TextField } from "@mui/material";
import { useCookies } from "react-cookie";

export default function Perfil() {
  const [cookies] = useCookies(["usuario"]);

  return (
    <div className="h-full w-full flex flex-col items-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
        👤 Perfil
      </p>
      <div className="flex md:flex-row flex-col h-full w-full md:px-10">
        <div className="bg-theme-container flex flex-col justify-between items-center md:w-[40%] w-full px-5 pt-8 pb-5 h-full rounded-[15px]">
          <div className="flex items-center justify-center">
            <div className="border bg-theme-white p-5 border-theme-blue rounded-full w-fit">
              <PersonIcon
                className="text-theme-blue"
                sx={{ fontSize: "5rem" }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 justify-center">
            <p className="font-medium">{cookies?.usuario?.nome}</p>
            <p className="text-theme-text font-normal text-[0.9rem]">
              @{cookies?.usuario?.login}
            </p>
            {cookies?.usuario?.celular && (
              <p className="text-theme-text font-normal text-[0.9rem]">
                {cookies?.usuario?.celular}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="bg-[#d1d1d1] text-theme-blue font-medium px-4 py-2 rounded-[5px]">
              {cookies?.usuario?.permissao?.nomePermissao}
            </p>
            <p className="text-theme-text text-[0.9rem] font-medium mt-5">
              Login: {cookies?.usuario?.lastLogin}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between items-center md:w-[60%] w-full py-5 md:px-5 h-full">
          <div className="w-full">
            <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
              Editar perfil
            </p>
          </div>

          <div className="w-full">
            <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
              Senha
            </p>

            <form noValidate className="flex flex-col gap-2">
              <TextField
                id="filled-basic"
                label="Senha atual"
                variant="filled"
                type="password"
                name="senha_atual"
                // value={form.senha_atual}
                // onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />

              <TextField
                id="filled-basic"
                label="Nova senha"
                variant="filled"
                type="password"
                name="nova_senha"
                // value={form.nova_senha}
                // onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />

              <TextField
                id="filled-basic"
                label="Confirmar nova senha"
                variant="filled"
                type="password"
                name="confirmar_nova_senha"
                // value={form.confirmar_nova_senha}
                // onChange={handleChange}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md"
              />
            </form>

            <div className="w-full flex items-center justify-end mt-3">
              <DefaultButton text={"Atualizar senha"} disabled={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
