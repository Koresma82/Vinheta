import React, { useState } from 'react'
import { Clock, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '../AuthContext'

const gold = '#d4af37'
const muted = 'rgba(253, 230, 138, 0.6)'

export default function PendingApproval({ status }) {
  const { user, logout, refreshStatus } = useAuth()
  const [checking, setChecking] = useState(false)
  const [checked, setChecked] = useState(false)

  const verificar = async () => {
    setChecking(true)
    await refreshStatus()
    setChecked(true)
    setChecking(false)
  }

  const isRejected = status === 'rejected' || status === 'revoked'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #0f0a08 0%, #1a1410 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${isRejected ? 'rgba(239,68,68,0.3)' : 'rgba(212, 175, 55, 0.2)'}`,
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        textAlign: 'center'
      }}>
        {/* Ícone */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>
          {isRejected ? '🚫' : '⏳'}
        </div>

        {/* Logo */}
        <img src="/logo.png" alt="Vinheta" style={{ height: '48px', margin: '0 auto 1rem', display: 'block' }} />

        {/* Título */}
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: gold, fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
          {isRejected ? 'Acesso Negado' : 'Aguarda Aprovação'}
        </h1>

        {/* Mensagem */}
        <p style={{ fontFamily: 'Lora, serif', color: muted, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          {isRejected
            ? 'O teu pedido de acesso foi recusado. Contacta o administrador para mais informações.'
            : <>O teu pedido foi registado com <strong style={{ color: gold }}>{user?.email}</strong>.<br /><br />Aguarda aprovação do administrador. Receberás acesso assim que for aprovado.</>
          }
        </p>

        {/* Botões */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!isRejected && (
            <button
              onClick={verificar}
              disabled={checking}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '0.75rem',
                background: checking ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: gold,
                fontFamily: 'Lora, serif',
                fontWeight: '600',
                cursor: checking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} style={{ animation: checking ? 'spin 1s linear infinite' : 'none' }} />
              {checking ? 'A verificar...' : 'Verificar Estado'}
            </button>
          )}

          {checked && !isRejected && (
            <p style={{ fontFamily: 'Lora, serif', color: muted, fontSize: '0.8rem' }}>
              Ainda em aprovação. Tenta mais tarde.
            </p>
          )}

          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '0.75rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5',
              fontFamily: 'Lora, serif',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
