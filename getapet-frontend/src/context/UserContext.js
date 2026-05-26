import { createContext } from 'react'
import useAuth from '../hooks/useAuth'

const Context = createContext()

function UserProvider({ children }) {
  const { authenticated, user, loading, register, logout, login } = useAuth()
  return (
    <Context.Provider value={{ authenticated, user, loading, register, logout, login }}>
      {children}
    </Context.Provider>
  )
}

export { Context, UserProvider }
