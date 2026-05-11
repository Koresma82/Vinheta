import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { registarUtilizador, obterStatusUtilizador, isSuperAdmin } from './services/fbSuperAdmin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userStatus, setUserStatus] = useState(null) // 'pending' | 'approved' | 'rejected' | 'superadmin'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // SuperAdmin nunca precisa de aprovação
        if (isSuperAdmin(currentUser.email)) {
          setUser(currentUser)
          setUserStatus('superadmin')
          setLoading(false)
          return
        }

        // Utilizador normal: registar/verificar status
        try {
          const status = await registarUtilizador(currentUser)
          setUser(currentUser)
          setUserStatus(status)
        } catch (err) {
          console.error('Erro ao verificar status:', err)
          setUserStatus('pending')
        }
      } else {
        setUser(null)
        setUserStatus(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    try {
      setError(null)
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const loginWithEmail = async (email, password) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setUserStatus(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const refreshStatus = async () => {
    if (!user || isSuperAdmin(user.email)) return
    try {
      const data = await obterStatusUtilizador(user.uid)
      if (data) setUserStatus(data.status)
    } catch (err) {
      console.error('Erro ao refrescar status:', err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userStatus, loading, error, loginWithGoogle, loginWithEmail, logout, refreshStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
