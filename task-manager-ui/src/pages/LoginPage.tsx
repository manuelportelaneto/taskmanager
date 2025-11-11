import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <main className="container">
      <article>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p><small style={{ color: 'var(--pico-color-red-500)' }}>{error}</small></p>}
          <button type="submit" aria-busy={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <footer>
          <small>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </small>
        </footer>
      </article>
    </main>
  );
};

export default LoginPage;
