import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Home from './components/Home/Home';
import PetProfile from './components/PetProfile/PetProfile';
import AdoptionFlow from './components/AdoptionFlow/AdoptionFlow';
import UserProvider from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pet/:id"  element={<PetProfile />} />
          <Route path="/adopt/:id" element={<AdoptionFlow />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
