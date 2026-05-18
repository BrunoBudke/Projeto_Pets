import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/UserContext';

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const { login, message } = useContext(Context);
  const navigate = useNavigate();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    login(user, navigate);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo"> Get A Pet</Link>
        <h1>Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre na sua conta para continuar</p>

        {}
        {message && (
          <div className={`auth-message auth-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={user.password}
              onChange={handleChange}
            />
          </div>

          
          <p className="auth-hint">
             Teste: <strong>teste@email.com</strong> / <strong>1234</strong>   
          </p>

          <button type="submit" className="btn-submit">Entrar</button>
        </form>

        <p className="auth-footer">
          Não tem uma conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>

      <div className="auth-visual">
        <h2>Adote com amor </h2>
        <p>Milhares de pets esperando por você</p>
      </div>
    </div>
  );
}

export default Login;
