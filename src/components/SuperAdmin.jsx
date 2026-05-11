import React, { useState, useEffect } from 'react'
import { Users, CheckCircle, XCircle, Clock, TrendingUp, RefreshCw, Shield, LogOut, Euro, Activity } from 'lucide-react'
import { listarUtilizadores, aprovarUtilizador, rejeitarUtilizador, revogarUtilizador, obterConsumoTotal } from '../services/fbSuperAdmin'
import { useAuth } from '../AuthContext'

const gold = '#d4af37'
const muted = 'rgba(253, 230, 138, 0.6)'
const bg = 'rgba(255,255,255,0.04)'
const border = '1px solid rgba(212, 175, 55, 0.2)'

const card = { background: bg, border, borderRadius: '1rem', padding: '1.25rem', marginBottom: '0.75rem' }
const label = { fontFamily: 'Playfair Display, serif', color: gold }
const body = { fontFamily: 'Lora, serif', color: muted, fontSize: '0.85rem' }

const statusColor = {
  pending: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', color: '#fbbf24' },
  approved: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', color: '#4ade80' },
  rejected: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#f87171' },
  revoked: { bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.4)', color: '#9ca3af' }
}
const statusLabel = { pending: '⏳ Pendente', approved: '✅ Aprovado', rejected: '❌ Rejeitado', revoked: '🚫 Revogado' }

export default function SuperAdmin() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('pending')
  const [users, setUsers] = useState([])
  const [consumo, setConsumo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)

  useEffect(() => { carregar() }, [tab])

  const carregar = async () => {
    setLoading(true)
    try {
      if (tab === 'consumo') {
        const c = await obterConsumoTotal()
        setConsumo(c)
      } else {
        const filtro = tab === 'todos' ? 'todos' : tab
        const u = await listarUtilizadores(filtro)
        setUsers(u)
      }
    } finally {
      setLoading(false)
    }
  }

  const aprovar = async (uid) => {
    setActioning(uid + '_approve')
    await aprovarUtilizador(uid, user.email)
    await carregar()
    setActioning(null)
  }

  const rejeitar = async (uid) => {
    const motivo = prompt('Motivo (opcional):') ?? ''
    setActioning(uid + '_reject')
    await rejeitarUtilizador(uid, user.email, motivo)
    await carregar()
    setActioning(null)
  }

  const revogar = async (uid) => {
    if (!confirm('Revogar acesso?')) return
    setActioning(uid + '_revoke')
    await revogarUtilizador(uid)
    await carregar()
    setActioning(null)
  }

  const formatData = (ts) => {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const tabs = [
    { id: 'pending', label: 'Pendentes', icon: Clock },
    { id: 'approved', label: 'Aprovados', icon: CheckCircle },
    { id: 'rejected', label: 'Rejeitados', icon: XCircle },
    { id: 'todos', label: 'Todos', icon: Users },
    { id: 'consumo', label: 'Consumo API', icon: TrendingUp }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0a08 0%, #1a1410 100%)' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,10,8,0.97)',
        borderBottom: border,
        padding: '0 1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} style={{ color: gold }} />
            <span style={{ fontFamily: 'Playfair Display, serif', color: gold, fontWeight: 'bold', fontSize: '1.1rem' }}>
              SuperAdmin
            </span>
            <span style={{
              fontFamily: 'Lora, serif', fontSize: '0.7rem',
              padding: '0.15rem 0.5rem', borderRadius: '999px',
              background: 'rgba(212,175,55,0.15)', color: gold,
              border: '1px solid rgba(212,175,55,0.3)'
            }}>
              {user?.email}
            </span>
          </div>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Lora, serif', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  fontFamily: 'Lora, serif',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: tab === t.id ? gold : 'rgba(212,175,55,0.1)',
                  color: tab === t.id ? '#1a0e0e' : gold,
                  border: `1px solid ${tab === t.id ? gold : 'rgba(212,175,55,0.3)'}`
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontFamily: 'Lora, serif' }}>
            <RefreshCw size={24} style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 1s linear infinite' }} />
            A carregar...
          </div>
        )}

        {/* ===== CONSUMO API ===== */}
        {!loading && tab === 'consumo' && consumo && (
          <div>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Chamadas', value: consumo.totalChamadas, icon: '📡' },
                { label: 'Custo Total', value: `€${consumo.totalCusto.toFixed(2)}`, icon: '💶' },
                { label: 'Utilizadores', value: consumo.porUtilizador.length, icon: '👥' }
              ].map(kpi => (
                <div key={kpi.label} style={{ ...card, textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{kpi.icon}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', color: gold, fontSize: '1.3rem', fontWeight: 'bold' }}>{kpi.value}</div>
                  <div style={{ ...body, fontSize: '0.75rem' }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Por utilizador */}
            <h3 style={{ ...label, fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} /> Por utilizador
            </h3>
            {consumo.porUtilizador.length === 0 && (
              <div style={{ ...card, textAlign: 'center', color: muted, fontFamily: 'Lora, serif' }}>
                Sem dados de consumo ainda.
              </div>
            )}
            {consumo.porUtilizador.sort((a, b) => (b.custo_estimado || 0) - (a.custo_estimado || 0)).map(u => (
              <div key={u.uid} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ ...label, fontSize: '0.95rem', margin: '0 0 0.25rem' }}>{u.displayName || u.email}</p>
                    <p style={{ ...body, margin: 0 }}>{u.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', color: gold, fontWeight: 'bold', margin: '0 0 0.2rem' }}>
                      €{(u.custo_estimado || 0).toFixed(2)}
                    </p>
                    <p style={{ ...body, margin: 0 }}>{u.chamadas_totais || 0} chamadas</p>
                  </div>
                </div>
                {/* Barra de progresso */}
                <div style={{ marginTop: '0.75rem', height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '4px',
                    background: gold,
                    width: `${Math.min(100, ((u.custo_estimado || 0) / Math.max(consumo.totalCusto, 0.01)) * 100)}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== LISTA UTILIZADORES ===== */}
        {!loading && tab !== 'consumo' && (
          <div>
            {users.length === 0 && (
              <div style={{ ...card, textAlign: 'center', color: muted, fontFamily: 'Lora, serif', padding: '3rem 1rem' }}>
                {tab === 'pending' ? '✅ Sem pedidos pendentes!' : 'Sem utilizadores nesta categoria.'}
              </div>
            )}

            {users.map(u => {
              const sc = statusColor[u.status] || statusColor.pending
              return (
                <div key={u.id} style={card}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>

                    {/* Info utilizador */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        {u.photoURL && (
                          <img src={u.photoURL} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${gold}` }} />
                        )}
                        <span style={{ ...label, fontSize: '0.95rem' }}>{u.displayName || 'Sem nome'}</span>
                        <span style={{
                          fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          fontFamily: 'Lora, serif'
                        }}>
                          {statusLabel[u.status] || u.status}
                        </span>
                      </div>
                      <p style={{ ...body, margin: '0 0 0.25rem' }}>📧 {u.email}</p>
                      <p style={{ ...body, margin: 0, fontSize: '0.75rem' }}>
                        Pedido: {formatData(u.requestedAt)}
                        {u.approvedAt && <> · Aprovado: {formatData(u.approvedAt)}</>}
                        {u.rejectedAt && <> · Rejeitado: {formatData(u.rejectedAt)}</>}
                      </p>
                      {u.rejectedReason && (
                        <p style={{ ...body, margin: '0.25rem 0 0', color: '#f87171', fontSize: '0.75rem' }}>
                          Motivo: {u.rejectedReason}
                        </p>
                      )}
                    </div>

                    {/* Ações */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                      {u.status === 'pending' && (
                        <>
                          <button
                            onClick={() => aprovar(u.id)}
                            disabled={!!actioning}
                            style={{
                              padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                              background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)',
                              color: '#4ade80', fontFamily: 'Lora, serif', fontSize: '0.8rem',
                              fontWeight: '600', cursor: 'pointer'
                            }}
                          >
                            {actioning === u.id + '_approve' ? '...' : '✅ Aprovar'}
                          </button>
                          <button
                            onClick={() => rejeitar(u.id)}
                            disabled={!!actioning}
                            style={{
                              padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171', fontFamily: 'Lora, serif', fontSize: '0.8rem',
                              fontWeight: '600', cursor: 'pointer'
                            }}
                          >
                            {actioning === u.id + '_reject' ? '...' : '❌ Rejeitar'}
                          </button>
                        </>
                      )}
                      {u.status === 'approved' && (
                        <button
                          onClick={() => revogar(u.id)}
                          disabled={!!actioning}
                          style={{
                            padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                            background: 'rgba(107,114,128,0.15)', border: '1px solid rgba(107,114,128,0.3)',
                            color: '#9ca3af', fontFamily: 'Lora, serif', fontSize: '0.8rem',
                            fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          {actioning === u.id + '_revoke' ? '...' : '🚫 Revogar'}
                        </button>
                      )}
                      {(u.status === 'rejected' || u.status === 'revoked') && (
                        <button
                          onClick={() => aprovar(u.id)}
                          disabled={!!actioning}
                          style={{
                            padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                            color: '#4ade80', fontFamily: 'Lora, serif', fontSize: '0.8rem',
                            fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          {actioning === u.id + '_approve' ? '...' : '✅ Reativar'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
