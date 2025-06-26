import { ChangeEvent, FormEvent, useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.login || !form.senha) {
      setError('Por favor, preencha login e senha.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simula uma chamada API (substitua pelo seu fetch/axios)
      await new Promise((r) => setTimeout(r, 1500));

      // Aqui você faria a chamada real para o backend
      // Exemplo: const resp = await api.login(form.login, form.senha);

      // Simula login com usuário "admin" e senha "1234"
      if (form.login === 'admin' && form.senha === '1234') {
        alert('Login realizado com sucesso!');
        setForm({ login: '', senha: '' });
        // Redirecione para dashboard, por exemplo
      } else {
        setError('Login ou senha incorretos.');
      }
    } catch (err) {
      setError('Erro ao tentar logar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 10 }}>
          <input
            type="text"
            name="login"
            placeholder="Login"
            value={form.login}
            onChange={handleChange}
            disabled={loading}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            disabled={loading}
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
