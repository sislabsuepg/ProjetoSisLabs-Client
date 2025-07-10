"use client";
import { data_images } from "@/assets/data";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Login.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import { apiOnline } from "@/services/services";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ login: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      const data = await apiOnline.post(`/${callRoute}login`, {
        login: form.login,
        senha: form.senha,
      });
      toast.success("teste!");
      // redirecionar para a pagina inicial
    } catch (err: any) {
      const apiErrors = err.response?.data?.erros || [];
      if (apiErrors.length > 0) {
        const apiErrObj: { [key: string]: string } = {};
        apiErrors.forEach((erro: { campo: string; mensagem: string }) => {
          apiErrObj[erro.campo] = erro.mensagem;
        });
        setErrors(apiErrObj);
      } else {
        toast.error("Erro ao conectar com o servidor.!");
      }
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ field }: { field: string }) =>
    errors[field] ? (
      <div style={{ color: "red", marginTop: 4 }}>{errors[field]}</div>
    ) : null;

  return (
    <section id="login" className={`${styles.sectionLogin}`}>
      <div className={`${styles.sideLogo}`}>
        <img
          className={`${styles.logoImg}`}
          src={data_images?.logo_uepg_desktop_white}
          alt={"Logo UEPG DESKTOP"}
        />
        <p className="text-[1.2rem]">
          A instituição que, diferentemente de uma ruptura com o passado,{" "}
          <strong>avança</strong> a partir de suas <strong>conquistas</strong>.
        </p>
      </div>
      <div className={`${styles.sideLogin}`}>
        <div className="flex flex-col items-center justify-center">
          <PersonIcon sx={{ fontSize: 50 }} className="text-lightBlue" />
          <p className="text-light-blue">
            Acesso ao controle dos laboratórios do DEINFO
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              name="login"
              placeholder="Login"
              value={form.login}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
            <ErrorMessage field="login" />
          </div>

          <div style={{ marginBottom: 10 }}>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              disabled={loading}
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
            <ErrorMessage field="senha" />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}
