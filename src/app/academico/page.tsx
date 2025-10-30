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
import { ILaboratorio } from "@/interfaces/interfaces";
import { apiOnline } from "@/services/services";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import DefaultButton from "@/components/DefaultButton";
import { data_images } from "@/assets/data";
import { removeLetters } from "@/utils/removeLetters";
import { maskPhone } from "@/utils/maskPhone";
import { atualizarPerfil } from "@/schemas";

export default function Cronograma() {
  const router = useRouter();
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [cookies, , removeCookie] = useCookies(["aluno", "usuario"]);
  const [form, setForm] = useState({
    idLaboratorio: 0,
    senha_atual: "",
    nova_senha: "",
    confirmar_nova_senha: "",
    telefone: cookies.aluno?.telefone || "",
    email: cookies.aluno?.email || "",
  });

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
      await apiOnline.post("/solicitacoes", {
        idAluno: cookies.aluno.id,
        idLaboratorio: form.idLaboratorio,
      });

      toast.success("Sala solicitada com sucesso!");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const erros = err.response?.data?.erros as string[] | undefined;
        if (Array.isArray(erros)) {
          erros.forEach((e) => toast.error(e));
          return;
        }
      }
      toast.error("Erro ao solicitar sala.");
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
          await apiOnline.get(`/aluno/laboratorios/${cookies.aluno.id}`);
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
    try {
      const teste = await atualizarPerfil.validate({
        email: form.email,
        telefone: form.telefone,
      });
      console.log(teste);
      await apiOnline.put(`/aluno/perfil/${cookies.aluno.id}`, {
        email: form.email,
        telefone: form.telefone,
      });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: unknown) {
      const errObj = error as { response?: { data?: { erros?: string[] } } };
      if (errObj?.response?.data?.erros) {
        errObj.response.data.erros.forEach((e: string) => toast.error(e));
        return;
      }
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };
  const handleSenhaUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiOnline.post("aluno/verificasenha", {
        login: cookies.aluno.ra,
        senha: form.senha_atual,
      });
      await apiOnline.put(`/aluno/senha/${cookies.aluno.id}`, {
        novaSenha: form.nova_senha,
      });
      toast.success("Senha alterada com sucesso!");
      setForm({
        ...form,
        senha_atual: "",
        nova_senha: "",
        confirmar_nova_senha: "",
      });
    } catch (error: unknown) {
      const errObj = error as { response?: { data?: { erros?: string[] } } };
      if (errObj?.response?.data?.erros) {
        errObj.response.data.erros.forEach((e: string) => toast.error(e));
        return;
      }
    }
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
    <section
      className={`transition-all duration-500 flex-1 min-h-screen md:min-h-[calc(100vh-2.5rem)] m-5 border-4 p-5 border-[#F3F3F3] rounded-[20px] box-border overflow-x-auto overflow-y-auto`}
    >
      <div className="flex items-start mb-4">
        <div className="perfil-header flex flex-col items-start">
          <p className="font-semibold text-[1.2rem] text-theme-blue">
            Área do Acadêmico
          </p>
          <p className="text-sm font-medium text-theme-blue">
            Gerencie seu perfil, senha e solicite o uso de laboratórios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-theme-container rounded-2xl p-6 flex flex-col h-full">
          <div className="perfil-info-card wrapper">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="border bg-[#dedede] p-4 border-theme-blue rounded-full">
                <img src={data_images?.academico} alt="Área do Acadêmico" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-semibold text-[1.2rem] leading-5 text-theme-blue mb-1">
                  {cookies?.aluno?.nome}
                </p>
                <p className="text-theme-text text-xs md:text-sm font-medium">
                  {cookies?.usuario?.nome}
                </p>
                {cookies?.aluno?.telefone && (
                  <p className="text-theme-text text-xs md:text-sm font-medium">
                    {maskPhone(cookies?.aluno?.telefone)}
                  </p>
                )}
                <p className="text-theme-text text-xs md:text-sm font-medium">
                  {cookies?.aluno?.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-theme-blue bg-[#dedede] rounded-md py-3 font-medium my-2 text-xs md:text-[1rem]">
                {cookies?.aluno?.curso?.nome}
              </p>
              <p className="text-theme-text text-xs md:text-sm font-normal">
                <span className="font-medium text-theme-text">Último login:</span>{" "}
                {cookies?.aluno?.lastLogin}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-8">
            <div className="flex justify-center mb-4">
              <img
                className="w-full max-w-[180px] opacity-85"
                src={data_images?.logo_uepg_desktop}
                alt="Logo UEPG"
              />
            </div>

            <button
              className="logout-button bg-theme-blue/90 hover:bg-theme-blue transition-colors font-medium h-9 text-xs md:text-sm w-full text-white rounded-lg"
              onClick={() => {
                removeCookie("aluno", { path: "/" });
                router.push("/login");
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="editar-perfil-section bg-theme-container rounded-2xl py-4 px-5">
            <h2 className="font-semibold text-theme-blue text-lg mb-4 flex items-center gap-2">
              Editar perfil
            </h2>
            <form
              onSubmit={handlePerfilUpdate}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Email"
                  variant="filled"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full"
                  size="small"
                />
                <TextField
                  label="Telefone"
                  variant="filled"
                  type="text"
                  name="telefone"
                  value={maskPhone(form.telefone) || ""}
                  onChange={handleChange}
                  className="w-full"
                  size="small"
                />
              </div>
              <div className="flex items-center justify-end">
                <DefaultButton
                  text="Atualizar perfil"
                  disabled={
                    (form.email === "" || form.email.length > 40) &&
                    (form.telefone === "" || form.telefone.length < 11)
                  }
                />
              </div>
            </form>
          </div>

          <div className="alterar-senha-section bg-theme-container rounded-2xl py-4 px-5">
            <h2 className="font-semibold text-theme-blue text-lg mb-4 flex items-center gap-2">
              Alterar senha
            </h2>
            <form
              noValidate
              onSubmit={handleSenhaUpdate}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  label="Senha atual"
                  variant="filled"
                  type="password"
                  name="senha_atual"
                  value={form.senha_atual}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  label="Nova senha"
                  variant="filled"
                  type="password"
                  name="nova_senha"
                  value={form.nova_senha}
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  label="Confirmar nova senha"
                  variant="filled"
                  type="password"
                  name="confirmar_nova_senha"
                  value={form.confirmar_nova_senha}
                  onChange={handleChange}
                  size="small"
                />
              </div>
              <div className="flex items-center justify-end">
                <DefaultButton
                  text="Atualizar senha"
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
            </form>
          </div>

          <div className="solicitar-sala-section bg-theme-container rounded-2xl py-4 px-5">
            <h2 className="font-semibold text-theme-blue text-lg mb-4 flex items-center gap-2">
              Solicitar sala
            </h2>
            <div className="flex flex-col gap-4">
              <FormControl className="w-full" variant="filled" size="small">
                <InputLabel>Laboratório</InputLabel>
                <Select
                  name="idLaboratorio"
                  value={form.idLaboratorio}
                  onChange={handleSelectChange}
                >
                  <MenuItem value={0}>-- Selecione uma opção --</MenuItem>
                  {laboratorios.map((l) => (
                    <MenuItem key={l.id} value={l.id}>{`${l.numero} - ${l.nome
                      }${l.restrito ? "(Orientação)" : ""}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSolicitarSala}
                  disabled={!isFormValid}
                  className={`bg-theme-blue font-medium h-9 flex items-center justify-center text-sm px-6 text-white rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${!isFormValid
                    ? "opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0"
                    : ""
                    }`}
                >
                  Solicitar sala
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
