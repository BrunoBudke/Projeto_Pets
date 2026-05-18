import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../context/UserContext';

function Register() {
  const [user, setUser] = useState({ name: '', email: '', phone: '', password: '' });
  const { register, message } = useContext(Context);
  const navigate = useNavigate();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    register(user, navigate);
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo"> Get A Pet</Link>
        <h1>Crie sua conta</h1>
        <p className="auth-subtitle">Junte-se a nós e encontre seu pet ideal</p>

        
        {message && (
          <div className={`auth-message auth-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={user.name}
              onChange={handleChange}
            />
          </div>
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
            <label>Telefone</label>
            <input
              type="tel"
              name="phone"
              placeholder="(00) 00000-0000"
              value={user.phone}
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
          <button type="submit" className="btn-submit">Criar conta</button>
        </form>

        <p className="auth-footer">
          Já tem uma conta?{' '}
          <Link to="/login">Entrar</Link>
        </p>
      </div>

      <div className="auth-visual">
        <h2>Seja bem-vindo! </h2>
        <p>Faça parte da nossa comunidade</p>
      </div>
    </div>
  );
}

export default Register;
