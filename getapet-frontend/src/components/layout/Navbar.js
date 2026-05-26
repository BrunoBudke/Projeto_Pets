import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Context } from '../../context/UserContext'
import './Navbar.css'

export default function Navbar() {
  const { authenticated, logout } = useContext(Context)
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo"> Get A Pet</Link>

      <div className="nav-links">
        <Link to="/"        className={isActive('/')  ? 'nav-link active' : 'nav-link'}>Adotar</Link>
        <Link to="/explore" className={isActive('/explore') ? 'nav-link active' : 'nav-link'}>Explorar </Link>

        {authenticated && (
          <>
            <Link to="/mypets"  className={isActive('/mypets')  ? 'nav-link active' : 'nav-link'}>Meus Pets</Link>
            <Link to="/addpet"  className={isActive('/addpet')  ? 'nav-link nav-link--add active' : 'nav-link nav-link--add'}>+ Cadastrar Pet</Link>
            <span className="nav-link nav-logout" onClick={logout}>Sair</span>
          </>
        )}

        {!authenticated && (
          <>
            <Link to="/login"    className="nav-link">Entrar</Link>
            <Link to="/register" className="nav-link nav-link--register">Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  )
}
