'use client';
import { data_images } from '@/assets/data';
import { apiOnline } from '@/services/services';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Login.module.scss';

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

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { [key: string]: string } = {};
    if (!form.login) newErrors.login = 'Por favor, preencha o login.';
    if (!form.senha) newErrors.senha = 'Por favor, preencha a senha.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const callRoute = form.login.match(/^\d{1,13}$/) ? 'aluno/' : 'usuario/';
      const data = await apiOnline.post(`/${callRoute}login`, {
        login: form.login,
        senha: form.senha,
      });
      toast.success('teste!');
      console.log('testeee - ', data);
      router.push('/dashboard');
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
            'Ocorreu um erro desconhecido ao tentar conectar com o servidor.',
          );
        }
      } else if (err instanceof Error) {
        toast.error(`Ocorreu um erro inesperado: ${err.message}`);
      } else {
        toast.error('Ocorreu um erro totalmente inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  // refina o tipo da variável em um escopo específico
  function isCustomAxiosError(error: unknown): error is CustomAxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as { isAxiosError: boolean }).isAxiosError === true
    );
  }

  const ErrorMessage = ({ field }: { field: string }) =>
    errors[field] ? (
      <div style={{ color: 'red', marginTop: 4 }}>{errors[field]}</div>
    ) : null;

  return (
    <section id="login" className={`${styles.sectionLogin}`}>
      <div className={`${styles.sideLogo}`}>
        <img
          className={`${styles.logoImg}`}
          src={data_images?.logo_uepg_desktop_white}
          alt={'Logo UEPG DESKTOP'}
        />
        <p className="text-[1.2rem]">
          A instituição que, diferentemente de uma ruptura com o passado,{' '}
          <strong>avança</strong> a partir de suas <strong>conquistas</strong>.
        </p>
      </div>

      <div
        className={`flex flex-col items-center justify-center ${styles.sideLogin}`}
      >
        <div>
          <div className="relative mb-5 flex flex-col items-center">
            <img src={data_images?.user_login} alt="Login do usuário" />
            <p className="text-theme-text text-lg text-center mt-2">
              {' '}
              Acesso ao controle dos laboratórios do DEINFO
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="w-full">
            <div className="mb-4">
              {' '}
              <input
                type="text"
                name="login"
                placeholder="Login"
                value={form.login}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 text-base rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <ErrorMessage field="login" />
            </div>

            <div className="mb-6">
              {' '}
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={form.senha}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 text-base rounded-md border-none outline-none focus:ring-2 focus:ring-transparent bg-theme-inputBg text-[#767676] placeholder-[#767676]"
              />
              <ErrorMessage field="senha" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 text-base rounded-md border-none text-theme-white font-semibold transition-colors duration-200
              ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-theme-blue cursor-pointer'
              }
            `}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <button onClick={() => router.push('/dashboard')}>
          ir para a home (teste)
        </button>
      </div>
    </section>
  );
}
