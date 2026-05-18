import { createContext, useState } from 'react';

export const Context = createContext();

function UserProvider({ children }) {
  // Login (teste)
  const [users, setUsers] = useState([
    { name: 'Teste', email: 'teste@email.com', phone: '(48) 99999-0000', password: '1234' }
  ]);

  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState(null); 

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  }

  function register(user, navigate) {
    if (!user.name || !user.email || !user.password) {
      showMessage('error', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const exists = users.find((u) => u.email === user.email);
    if (exists) {
      showMessage('error', 'Este e-mail já está cadastrado!');
      return;
    }

    const newUser = { ...user };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthenticated(true);
    showMessage('success', `Conta criada! Bem-vindo, ${newUser.name}!`);
    navigate('/');
  }

  function login(user, navigate) {
    const found = users.find(
      (u) => u.email === user.email && u.password === user.password
    );

    if (!found) {
      showMessage('error', 'E-mail ou senha incorretos!');
      return;
    }

    setCurrentUser(found);
    setAuthenticated(true);
    showMessage('success', `Bem-vindo de volta, ${found.name}!`);
    navigate('/');
  }

  function logout(navigate) {
    setCurrentUser(null);
    setAuthenticated(false);
    navigate('/login');
  }

  return (
    <Context.Provider value={{ authenticated, currentUser, register, login, logout, message }}>
      {children}
    </Context.Provider>
  );
}

export default UserProvider;
