import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import FlashMessage from './components/layout/FlashMessage'
import Home  from './components/Home/Home'
import Login   from './components/pages/Auth/Login'
import Register  from './components/pages/Auth/Register'
import PetProfile   from './components/pages/Pet/PetProfile'
import AdoptionFlow from './components/pages/Pet/AdoptionFlow'
import Explore  from './components/pages/Explore/Explore'
import AddPet   from './components/pages/Pet/AddPet'
import MyPets  from './components/pages/Pet/MyPets'

function App() {
  return (
    <Router>
      <UserProvider>
        <FlashMessage />
        <Routes>
          <Route path="/"   element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/explore"   element={<Explore />} />
          <Route path="/pet/:id"   element={<PetProfile />} />
          <Route path="/adopt/:id" element={<AdoptionFlow />} />
          <Route path="/addpet"    element={<AddPet />} />
          <Route path="/mypets"    element={<MyPets />} />
        </Routes>
      </UserProvider>
    </Router>
  )
}

export default App
