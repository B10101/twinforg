import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { setToken, backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  // =====================
  // Email / Password Auth
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      const endpoint =
        mode === 'signup'
          ? '/api/user/register'
          : '/api/user/login'

      const payload =
        mode === 'signup'
          ? { name, email, password }
          : { email, password }

      const { data } = await axios.post(backendUrl + endpoint, payload)

      if (!data.success) {
        toast.error(data.message)
        return
      }

      setToken(data.token)
      localStorage.setItem('token', data.token)
      toast.success(data.message || 'Login successful')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  // =====================
  // Google Auth
  // =====================
  const handleGoogleSuccess = async (res) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/google-login',
        { credential: res.credential }
      )

      if (!data.success) {
        toast.error(data.message)
        return
      }

      setToken(data.token)
      localStorage.setItem('token', data.token)
      toast.success('Google login successful')
      navigate('/')
    } catch {
      toast.error('Google login failed')
    }
  }

  return (
    <div className="w-[90%] sm:max-w-96 m-auto mt-16 text-gray-800">

      {/* Title */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <p className="prata-regular text-3xl">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </p>
        <hr className="h-[1.5px] w-8 bg-gray-800 border-none" />
      </div>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-800 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-800 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-800 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-between text-sm">
          <span
            onClick={() => navigate('/forgot-password')}
            className="cursor-pointer hover:underline"
          >
            Forgot password?
          </span>

          <span
            onClick={() =>
              setMode(mode === 'login' ? 'signup' : 'login')
            }
            className="cursor-pointer"
          >
            {mode === 'login'
              ? 'Create account'
              : 'Login instead'}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 mt-2 disabled:opacity-60"
        >
          {loading
            ? 'Please wait...'
            : mode === 'login'
            ? 'Sign In'
            : 'Sign Up'}
        </button>
      </form>

      {/* ================= DIVIDER ================= */}
      <div className="flex items-center gap-2 my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-500 text-sm">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* ================= GOOGLE LOGIN ================= */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google login failed')}
          size="large"
          theme="outline"
        />
      </div>
    </div>
  )
}

export default Login
