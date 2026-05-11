import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import Login from './pages/Login'
import PendingApproval from './pages/PendingApproval'
import SuperAdmin from './components/SuperAdmin'
import WinePairingForm from './components/WinePairingForm-v2'
import GarrafeiraPessoal from './components/GarrafeiraPessoal'
import NotasProva from './components/NotasProva'
import Dashboard from './components/Dashboard'
import Wishlist from './components/Wishlist'
import AnaliseVisual from './components/AnaliseVisual'
import Historico from './components/Historico'
import { Wine, BookOpen, BarChart3, Star, Target, Eye, LogOut, Clock } from 'lucide-react'
import './App.css'

function App() {
  const { user, userStatus, loading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('sommelier')

  // Loading
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
        <div style={{ textAlign: 'center', color: '#d4af37', fontFamily: 'Playfair Display, serif' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍷</div>
          Carregando...
        </div>
      </div>
    )
  }

  // Não autenticado
  if (!user) return <Login />

  // SuperAdmin
  if (userStatus === 'superadmin') return <SuperAdmin />

  // Pendente ou rejeitado
  if (userStatus === 'pending' || userStatus === 'rejected' || userStatus === 'revoked') {
    return <PendingApproval status={userStatus} />
  }

  // App normal (approved)
  const tabs = [
    { id: 'sommelier', label: 'Vinheta', icon: Wine, component: WinePairingForm },
    { id: 'historico', label: 'Histórico', icon: Clock, component: Historico },
    { id: 'garrafeira', label: 'Garrafeira', icon: BookOpen, component: GarrafeiraPessoal },
    { id: 'provas', label: 'Provas', icon: Star, component: NotasProva },
    { id: 'analise', label: 'Análise', icon: Eye, component: AnaliseVisual },
    { id: 'wishlist', label: 'Wishlist', icon: Target, component: Wishlist },
    { id: 'dashboard', label: 'Stats', icon: BarChart3, component: Dashboard }
  ]

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(26,14,14,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Vinheta" className="h-10 w-10" style={{ borderRadius: '4px' }} />
              <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '20px' }} className="font-bold hidden sm:block">
                Vinheta
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto flex-1 mx-4">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition text-sm whitespace-nowrap"
                    style={{
                      background: activeTab === tab.id ? '#d4af37' : 'transparent',
                      color: activeTab === tab.id ? '#1a0e0e' : '#d4af37'
                    }}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-amber-200 text-sm font-semibold truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-amber-100/50 text-xs">Utilizador</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg transition"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {ActiveComponent && <ActiveComponent userId={user.uid} />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-amber-100/50 text-sm" style={{ fontFamily: 'Lora, serif' }}>
          <p>Vinheta | O vinho certo para o seu prato</p>
          <p className="mt-2">© 2026 Vinheta · Desenvolvido por TechRamen</p>
        </div>
      </footer>
    </div>
  )
}

export default App
