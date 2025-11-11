import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await api.post('/users', { email, password });
      setSuccess(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <article>
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          {success && (
            <p style={{ color: 'var(--pico-color-green-500)' }}>
              Registration successful! You can now{' '}
              <Link to="/login">log in</Link>.
            </p>
          )}
          {error && <p style={{ color: 'var(--pico-color-red-500)' }}>{error}</p>}
          
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
          <button type="submit" aria-busy={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <footer>
          <small>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </small>
        </footer>
      </article>
    </main>
  );
};

export default RegisterPage;
