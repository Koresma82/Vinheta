import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { loginWithGoogle, error, loading } = useAuth()
  const [localError, setLocalError] = useState(null)

  const handleGoogleLogin = async () => {
    try {
      setLocalError(null)
      await loginWithGoogle()
    } catch (err) {
      setLocalError('Erro ao fazer login. Tenta novamente.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #0f0a08 0%, #1a1410 50%, #0f0a08 100%)'
    }}>
      
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>

        {/* Logo + Título */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/logo.png"
            alt="Vinheta"
            style={{ height: '64px', width: '64px', objectFit: 'contain', margin: '0 auto 1rem' }}
          />
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            color: '#d4af37',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 0.25rem'
          }}>
            Vinheta
          </h1>
          <p style={{
            fontFamily: 'Lora, serif',
            color: '#d4af37',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '0 0 0.75rem'
          }}>
            Vinheta
          </p>
          <p style={{
            fontFamily: 'Lora, serif',
            color: 'rgba(253, 230, 138, 0.6)',
            fontSize: '0.9rem',
            margin: 0
          }}>
            O vinho certo para o seu prato
          </p>
        </div>

        {/* Divisor */}
        <div style={{ height: '1px', background: 'rgba(212, 175, 55, 0.2)', margin: '0 0 1.5rem' }} />

        {/* Features */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {[
            { emoji: '🍷', title: 'Coleciona Vinhos', desc: 'Guarda tua garrafeira pessoal' },
            { emoji: '⭐', title: 'Prova & Avalia', desc: 'Regista cada degustação' },
            { emoji: '🤖', title: 'IA Vinheta', desc: 'Recomendações personalizadas' }
          ].map(({ emoji, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{emoji}</span>
              <div>
                <p style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontWeight: '600', margin: '0 0 0.2rem', fontSize: '1rem' }}>
                  {title}
                </p>
                <p style={{ fontFamily: 'Lora, serif', color: 'rgba(253, 230, 138, 0.6)', fontSize: '0.85rem', margin: 0 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {(error || localError) && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(153, 27, 27, 0.3)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontFamily: 'Lora, serif',
            fontSize: '0.85rem'
          }}>
            ⚠️ {error || localError}
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            background: loading ? 'rgba(212, 175, 55, 0.3)' : 'linear-gradient(135deg, #d4af37, #e6c547)',
            color: '#1a0e0e',
            fontFamily: 'Lora, serif',
            fontWeight: '600',
            fontSize: '1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: loading ? 'none' : '0 8px 25px rgba(212, 175, 55, 0.35)',
            transition: 'transform 0.2s',
            marginBottom: '1rem'
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '20px', height: '20px',
                border: '2px solid rgba(26,14,14,0.3)',
                borderTop: '2px solid #1a0e0e',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              A carregar...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </>
          )}
        </button>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontFamily: 'Lora, serif', color: 'rgba(253, 230, 138, 0.3)', fontSize: '0.75rem', margin: 0 }}>
          Desenvolvido com ❤️ por TechRamen
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
