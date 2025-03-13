import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContext'
import { doSignOut } from '../firebase/auth'

const Header = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()

  return (
    <nav className="flex justify-between items-center w-full fixed top-0 left-0 h-12 border-b bg-gray-200 px-4">
      {/* Left Side */}
      <div>
        <button 
          onClick={() => navigate('/home')} 
          className="text-sm text-blue-600 underline"
        >
          Home
        </button>
      </div>
      
      {/* Right Side */}
      <div className="flex gap-2">
        {!userLoggedIn ? (
          <>
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm text-blue-600 underline"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="text-sm text-blue-600 underline"
            >
              Register
            </button>
          </>
        ) : (
          <button 
            onClick={() => doSignOut().then(() => navigate('/login'))}
            className="text-sm text-blue-600 underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
