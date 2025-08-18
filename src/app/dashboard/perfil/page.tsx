"use client";
import DefaultButton from "@/components/DefaultButton";
import PersonIcon from "@mui/icons-material/Person";
import { useCookies } from "react-cookie";

export default function Perfil() {
  const [cookies] = useCookies(["usuario"]);

  return (
    <div className="h-full w-full flex flex-col items-start">
      <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">Perfil</p>
      <div className="flex h-full w-full px-10">
        <div className="bg-theme-container flex flex-col justify-between items-center w-[40%] px-5 pt-8 pb-5 h-full rounded-[15px]">
          <div className="flex items-center justify-center">
            <div className="border bg-theme-white p-5 border-theme-blue rounded-full w-fit">
              <PersonIcon
                className="text-theme-blue"
                sx={{ fontSize: "5rem" }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 justify-center">
            <p className="font-medium">{cookies.usuario.nome}</p>
            <p className="text-theme-text font-normal text-[0.9rem]">
              @{cookies.usuario.login}
            </p>
            <p className="text-theme-text font-normal text-[0.9rem]">
              (42) 9 9999 - 9999
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="bg-[#d1d1d1] text-theme-blue font-medium px-4 py-2 rounded-[5px]">
              {cookies.usuario.permissao.nomePermissao}
            </p>
            <p className="text-theme-text text-[0.9rem] font-medium mt-5">
              Login: {cookies.usuario.lastLogin}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between items-center w-[60%] p-5 h-full">
          <div className="w-full">
            <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
              Editar perfil
            </p>

            <form noValidate className="flex flex-col gap-2">
              <input
                type="text"
                name="email"
                placeholder="E-Mail"
                // value={form.email}
                // onChange={handleChange}
                className="w-full p-3 text-[0.9rem] font-normal rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                // value={form.telefone}
                // onChange={handleChange}
                className="w-full p-3 text-[0.9rem] font-normal rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
            </form>

            <div className="w-full flex items-center justify-end mt-3">
              <DefaultButton text={"Atualizar perfil"} disabled={false} />
            </div>
          </div>

          <div className="w-full">
            <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
              Senha
            </p>

            <form noValidate className="flex flex-col gap-2">
              <input
                type="text"
                name="senha_atual"
                placeholder="Senha atual"
                // value={form.email}
                // onChange={handleChange}
                className="w-full p-3 text-[0.9rem] font-normal rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <input
                type="text"
                name="nova_senha"
                placeholder="Nova senha"
                // value={form.telefone}
                // onChange={handleChange}
                className="w-full p-3 text-[0.9rem] font-normal rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />

              <input
                type="text"
                name="confirmar_ova_senha"
                placeholder="Confirmar nova senha"
                // value={form.telefone}
                // onChange={handleChange}
                className="w-full p-3 text-[0.9rem] font-normal rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
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
