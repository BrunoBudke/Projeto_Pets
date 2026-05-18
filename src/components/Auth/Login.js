import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo">Get A Pet</Link>
        <h1>Bem-vindo de volta!</h1>
        <p className="auth-subtitle">Entre na sua conta para continuar</p>

        <div className="auth-form">
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button className="btn-submit">Entrar</button>
        </div>

        <p className="auth-footer">
          Não tem uma conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>

      <div className="auth-visual">
        <h2>Adote com amor</h2>
        <p>Milhares de pets esperando por você</p>
      </div>
    </div>
  );
}

export default Login;
