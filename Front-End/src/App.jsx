import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home.jsx'
import Login from './components/Login.jsx'

function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App

