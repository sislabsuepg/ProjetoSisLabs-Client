"use client";
import { data_images } from "@/assets/data";
import { apiOnline } from "@/services/services";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usuarioStore } from "@/store/globalStore";
import styles from "./Login.module.scss";

interface CustomAxiosError {
  isAxiosError: boolean;
  response?: {
    data?: {
      erros?: Array<{ campo: string; mensagem: string }>;
    };
    status?: number;
    statusText?: string;
  };
  message: string;
}

function formatDateTime(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // getMonth() is 0-indexed
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

export default function Login() {
  const [form, setForm] = useState({ login: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setUsuarioId, setUsuarioNome, setUsuarioLogin, setUsuarioPermissao } =
    usuarioStore();

  // Previne hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Limpa o estado do usuário quando entra na página de login
    setUsuarioId(0);
    setUsuarioNome("");
    setUsuarioLogin("");
    setUsuarioPermissao({
      nomePermissao: "",
      geral: false,
      cadastro: false,
      alteracao: false,
      relatorio: false,
      advertencia: false,
    });
    localStorage.removeItem("LastLogin");
  }, [setUsuarioId, setUsuarioNome, setUsuarioLogin, setUsuarioPermissao]);

  // Não renderiza até que o componente esteja montado no cliente
  if (!mounted) {
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!form.login) newErrors.login = "Por favor, preencha o login.";
    if (!form.senha) newErrors.senha = "Por favor, preencha a senha.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const callRoute = form.login.match(/^\d{1,13}$/) ? "aluno/" : "usuario/";
      const data: {
        data: {
          id: number;
          nome: string;
          login: string;
          permissaoUsuario: {
            nomePermissao: string;
            geral: boolean;
            cadastro: boolean;
            alteracao: boolean;
            relatorio: boolean;
            advertencia: boolean;
          };
        };
      } = await apiOnline.post(`/${callRoute}login`, {
        login: form.login,
        senha: form.senha,
      });
      setUsuarioId(data.data.id);
      setUsuarioNome(data.data.nome);
      setUsuarioLogin(data.data.login);
      setUsuarioPermissao(data.data.permissaoUsuario);
      localStorage.setItem("LastLogin", formatDateTime(new Date()));
      toast.success("teste!");
      console.log("testeee - ", data);
      router.push("/dashboard");
      // redirecionar para a pagina inicial
    } catch (err: unknown) {
      if (isCustomAxiosError(err)) {
        const apiErrors = err.response?.data?.erros || [];

        if (apiErrors.length > 0) {
          const apiErrObj: { [key: string]: string } = {};
          apiErrors.forEach((erro: { campo: string; mensagem: string }) => {
            toast.error(erro.mensagem);
            apiErrObj[erro.campo] = erro.mensagem;
          });
          setErrors(apiErrObj);
        } else if (err.message) {
          toast.error(`Erro de conexão: ${err.message}`);
        } else {
          toast.error(
            "Ocorreu um erro desconhecido ao tentar conectar com o servidor."
          );
        }
      } else if (err instanceof Error) {
        toast.error(`Ocorreu um erro inesperado: ${err.message}`);
      } else {
        toast.error("Ocorreu um erro totalmente inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  // refina o tipo da variável em um escopo específico
  function isCustomAxiosError(error: unknown): error is CustomAxiosError {
    return (
      typeof error === "object" &&
      error !== null &&
      "isAxiosError" in error &&
      (error as { isAxiosError: boolean }).isAxiosError === true
    );
  }

  const ErrorMessage = ({ field }: { field: string }) =>
    errors[field] ? (
      <div style={{ color: "red", marginTop: 4 }}>{errors[field]}</div>
    ) : null;

  return (
    <section
      id="login"
      className={`${styles.sectionLogin} lsm:flex-row flex-col h-screen`}
    >
      <div
        className={`${styles.sideLogo} lsm:flex hidden dlg:p-[2.5rem] p-[1.5rem] dlg:w-[40%] w-[45%]`}
      >
        <img
          className={`${styles.logoImg}`}
          src={data_images?.logo_uepg_desktop_white}
          alt={"Logo UEPG DESKTOP"}
        />
        <p className="dlg:text-[1.1rem] text-[1rem] leading-6 font-normal">
          A instituição que, diferentemente de uma ruptura com o passado,{" "}
          <strong>avança</strong> a partir de suas <strong>conquistas</strong>.
        </p>
      </div>

      <div
        className={`flex flex-col items-center justify-center dlg:w-[60%] lsm:w-[55%] w-full ${styles.sideLogin}`}
      >
        <div>
          <div className="relative mb-5 flex flex-col items-center">
            <img src={data_images?.user_login} alt="Login do usuário" />
            <p className="text-theme-text font-normal text-[0.9rem] text-center mt-2">
              {" "}
              Acesso ao controle dos laboratórios do DEINFO
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="mb-2">
              {" "}
              <input
                type="text"
                name="login"
                placeholder="Login"
                value={form.login}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 font-normal text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <ErrorMessage field="login" />
            </div>

            <div className="mb-3">
              {" "}
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                disabled={loading}
                className="w-full font-normal p-3 text-[0.9rem] rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <ErrorMessage field="senha" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-3 py-2 text-base font-normal rounded-md border-none text-theme-white text-[0.9rem] transition-colors duration-200
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-theme-blue cursor-pointer"
              }
            `}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <button
          onClick={() => {
            setUsuarioId(0);
            setUsuarioNome("Usuário Teste");
            setUsuarioLogin("usuario.teste");
            setUsuarioPermissao({
              nomePermissao: "Permissão Teste",
              geral: true,
              cadastro: true,
              alteracao: true,
              relatorio: true,
              advertencia: true,
            });
            localStorage.setItem("LastLogin", formatDateTime(new Date()));
            router.push("/dashboard");
          }}
        >
          ir para a home (teste)
        </button>
      </div>

      <div className="w-full h-[300px] bg-[#263E66] rounded-t-[100%] flex lsm:hidden items-center justify-center mt-10">
        <img
          src={data_images?.logo_uepg_mobile}
          alt={"Logo UEPG MOBILE"}
          className="w-full max-w-[250px]"
        />
      </div>
    </section>
  );
}
