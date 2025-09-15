"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { ILaboratorio } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import DefaultButton from "@/components/DefaultButton";
import { data_images } from "@/assets/data";
import { removeLetters } from "@/utils/removeLetters";
import { atualizarPerfil } from "@/schemas";
import { maskPhone } from "@/utils/maskPhone";

export default function Cronograma() {
  const router = useRouter();
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    idLaboratorio: 0,
    senha_atual: "",
    nova_senha: "",
    confirmar_nova_senha: "",
    telefone: "",
    email: "",
  });
  const [cookies, , removeCookie] = useCookies(["aluno", "usuario"]);

  // Determine redirect condition outside of render side-effects.
  // IMPORTANT: We no longer perform router.push() directly inside the render body
  // because doing so (and returning early) changed the hook order between renders
  // after logout, causing the React errors about hook mismatch.
  const shouldRedirect = !cookies.aluno || cookies.usuario; // kept original logic

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setForm({ ...form, idLaboratorio: Number(e.target.value) });
  };

  const isFormValid = form.idLaboratorio > 0;

  const handleSolicitarSala = async () => {
    try {
      const response = await apiOnline.post("/academico/solicitacao", {
        idAluno: cookies.aluno.id,
        idLaboratorio: form.idLaboratorio,
      });

      toast.success("Sala solicitada com sucesso!");
    } catch (err: unknown) {
      if (err.response?.data?.erros) {
        err.response.data.erros.forEach((e: string) => toast.error(e));
        return;
      } else {
        toast.error("Erro ao solicitar sala.");
      }
    }
  };

  // Handle redirect in an effect so hook order is stable across renders.
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    // Avoid fetching if we'll redirect
    if (shouldRedirect || !cookies.aluno) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const laboratoriosResponse: AxiosResponse<ILaboratorio[]> =
          await apiOnline.get(
            `/academico/laboratorio?idAluno=${cookies.aluno.id}`
          );
        setLaboratorios(laboratoriosResponse.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          const data = err.response?.data as { erros?: string[] } | undefined;
          if (data?.erros && data.erros.length > 0) {
            data.erros.forEach((e) => toast.error(e));
          } else {
            toast.error("Erro ao buscar dados. Tente novamente.");
          }
        } else {
          toast.error("Erro ao buscar dados. Tente novamente.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cookies.aluno, shouldRedirect]);

  const handlePerfilUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSenhaUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { name, value } = e.target;
    let newValue = value;

    if (name !== "idLaboratorio" && name !== "email") {
      newValue = removeLetters(value.trim());
    }
    console.log(value, newValue);
    setForm((prev) => ({ ...prev, [name]: newValue }));
  }

  // While redirecting just return null to avoid flicker; all hooks have already run.
  if (shouldRedirect) return null;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-10">
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
                {cookies?.aluno?.nome}
              </p>
              {cookies?.aluno?.telefone && (
                <p className="text-theme-text font-normal text-[0.9rem]">
                  {cookies?.aluno?.telefone}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="bg-[#d1d1d1] text-theme-blue font-medium px-4 py-2 rounded-[5px]">
                {cookies?.aluno?.email}
              </p>
              <p className="text-theme-text text-[0.9rem] font-medium mt-5">
                Curso: {cookies?.aluno?.curso?.nome}
              </p>
              <p className="text-theme-text text-[0.9rem] font-medium mt-5">
                Login: {cookies?.aluno?.lastLogin}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between items-center md:w-[60%] w-full py-5 md:px-5 h-full">
            <div className="w-full">
              <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
                Editar perfil
              </p>
              <form
                onSubmit={handlePerfilUpdate}
                noValidate
                className="flex flex-col gap-2"
              >
                <TextField
                  id="filled-basic"
                  label="Email"
                  variant="filled"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                />
                <TextField
                  id="filled-basic"
                  label="Telefone"
                  variant="filled"
                  type="text"
                  name="telefone"
                  value={maskPhone(form.telefone) || ""}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                />
                <div className="w-full flex items-center justify-end mt-3">
                  <DefaultButton
                    text={"Atualizar perfil"}
                    disabled={
                      (form.email === "" || form.email.length > 40) &&
                      (form.telefone === "" || form.telefone.length < 11)
                    }
                  />
                </div>
              </form>
            </div>

            <div className="w-full">
              <p className="font-semibold text-[1.2rem] text-theme-blue mb-4">
                Senha
              </p>

              <form
                noValidate
                onSubmit={handleSenhaUpdate}
                className="flex flex-col gap-2"
              >
                <TextField
                  id="filled-basic"
                  label="Senha atual"
                  variant="filled"
                  type="password"
                  name="senha_atual"
                  value={form.senha_atual}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                />

                <TextField
                  id="filled-basic"
                  label="Nova senha"
                  variant="filled"
                  type="password"
                  name="nova_senha"
                  value={form.nova_senha}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                />

                <TextField
                  id="filled-basic"
                  label="Confirmar nova senha"
                  variant="filled"
                  type="password"
                  name="confirmar_nova_senha"
                  value={form.confirmar_nova_senha}
                  onChange={handleChange}
                  className="w-full font-normal p-3 text-[0.9rem] rounded-md"
                />
              </form>

              <div className="w-full flex items-center justify-end mt-3">
                <DefaultButton
                  text={"Atualizar senha"}
                  disabled={
                    form.senha_atual.length >= 4 &&
                    form.senha_atual.length <= 6 &&
                    form.nova_senha.length >= 4 &&
                    form.nova_senha.length <= 6 &&
                    form.nova_senha === form.confirmar_nova_senha
                      ? false
                      : true
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col justify-start">
        <p className="font-semibold text-[1.2rem] text-theme-blue mb-2">
          Solicitar sala
        </p>

        <FormControl className="w-full" variant="filled">
          <InputLabel>Laboratório</InputLabel>
          <Select
            name="idLaboratorio"
            value={form.idLaboratorio}
            onChange={handleSelectChange}
          >
            <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
            {laboratorios.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {`${l.numero} - ${l.nome}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="w-full mt-10 flex items-center justify-end">
          <button
            type="submit"
            onClick={handleSolicitarSala}
            disabled={!isFormValid}
            className={`bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px] 
          ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Solicitar sala
          </button>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-center">
          <img
            className="w-full max-w-[150px]"
            src={data_images?.logo_uepg_desktop_white}
            alt="Logo UEPG"
          />
        </div>
        <button
          className="bg-theme-blue font-medium h-[35px] flex items-center justify-center text-[0.9rem] w-full max-w-[150px] text-white rounded-[10px]"
          onClick={() => {
            removeCookie("aluno", { path: "/" });
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
