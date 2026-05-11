import React, { useState } from 'react'
import { useAuth } from '../AuthContext'
import WinePairingForm from '../components/WinePairingForm'
import { LogOut, User } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 50%, #1a0e0e 100%)' }}>
      {/* Header */}
      <header className="border-b border-amber-600/20" style={{ background: 'rgba(26, 14, 14, 0.6)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#d4af37' }} className="font-bold">
              Vinheta
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-amber-100">
              <User size={18} />
              <span className="text-sm">{user?.displayName || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition hover:bg-amber-600/20 text-amber-100 hover:text-amber-200"
            >
              <LogOut size={18} />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <WinePairingForm userId={user?.uid} />
      </main>
    </div>
  )
}
