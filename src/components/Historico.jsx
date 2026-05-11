import React, { useState, useEffect } from 'react'
import { Clock, Trash2, Wine, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { listarHistoricoPratos, removerPratoHistorico } from '../services/fbHistoricoPratos'

export default function Historico({ userId }) {
  const [pratos, setPratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [expandido, setExpandido] = useState(null)
  const [search, setSearch] = useState('')
  const [removendo, setRemovendo] = useState(null)

  useEffect(() => {
    carregar()
  }, [filtro])

  const carregar = async () => {
    setLoading(true)
    try {
      const dados = await listarHistoricoPratos(userId, filtro)
      setPratos(dados)
    } finally {
      setLoading(false)
    }
  }

  const remover = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Remover esta refeição do histórico?')) return
    setRemovendo(id)
    try {
      await removerPratoHistorico(userId, id)
      setPratos(prev => prev.filter(p => p.id !== id))
    } finally {
      setRemovendo(null)
    }
  }

  const pratosFiltrados = pratos.filter(p =>
    p.prato?.toLowerCase().includes(search.toLowerCase())
  )

  const formatarData = (ts) => {
    if (!ts) return '—'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '1rem',
    marginBottom: '0.75rem',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  }

  const gold = '#d4af37'
  const muted = 'rgba(253, 230, 138, 0.6)'

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <Clock size={28} style={{ color: gold }} />
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: gold, fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Histórico
          </h1>
        </div>
        <p style={{ fontFamily: 'Lora, serif', color: muted, fontSize: '0.9rem' }}>
          Os teus pratos e vinhos favoritos
        </p>
      </div>

      {/* Search + Filtros */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: muted }} />
          <input
            type="text"
            placeholder="Pesquisar prato..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: '#f5deb3',
              fontFamily: 'Lora, serif',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'recentes', label: 'Esta semana' },
            { id: 'favoritos', label: 'Frequentes' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                fontFamily: 'Lora, serif',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: filtro === f.id ? gold : 'rgba(212, 175, 55, 0.1)',
                color: filtro === f.id ? '#1a0e0e' : gold,
                border: `1px solid ${filtro === f.id ? gold : 'rgba(212, 175, 55, 0.3)'}`
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontFamily: 'Lora, serif' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍷</div>
          A carregar histórico...
        </div>
      )}

      {/* Vazio */}
      {!loading && pratosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '1rem',
          color: muted,
          fontFamily: 'Lora, serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: gold }}>Sem refeições no histórico</p>
          <p style={{ fontSize: '0.85rem' }}>
            {search ? 'Nenhum prato encontrado.' : 'Usa o Sommelier IA e guarda as tuas refeições!'}
          </p>
        </div>
      )}

      {/* Lista */}
      {!loading && pratosFiltrados.map(p => (
        <div
          key={p.id}
          style={{
            ...cardStyle,
            borderColor: expandido === p.id ? 'rgba(212, 175, 55, 0.5)' : 'rgba(212, 175, 55, 0.2)'
          }}
          onClick={() => setExpandido(expandido === p.id ? null : p.id)}
        >
          {/* Row principal */}
          <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>

            {/* Esquerda */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🍽️</span>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  color: gold,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {p.prato}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Lora, serif', color: muted, fontSize: '0.75rem' }}>
                  📅 {formatarData(p.ultima_sugestao)}
                </span>
                <span style={{ fontFamily: 'Lora, serif', color: muted, fontSize: '0.75rem' }}>
                  💶 €{p.budget_min}–€{p.budget_max}
                </span>
                {p.vezes_sugerido > 1 && (
                  <span style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    color: gold,
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}>
                    🔁 {p.vezes_sugerido}×
                  </span>
                )}
                {p.confirmado_pelo_utilizador && (
                  <span style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}>
                    ✓ Confirmado
                  </span>
                )}
              </div>
            </div>

            {/* Direita */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={(e) => remover(p.id, e)}
                disabled={removendo === p.id}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(239, 68, 68, 0.5)',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 size={15} />
              </button>
              {expandido === p.id
                ? <ChevronUp size={16} style={{ color: gold }} />
                : <ChevronDown size={16} style={{ color: muted }} />
              }
            </div>
          </div>

          {/* Expandido */}
          {expandido === p.id && (
            <div style={{
              padding: '0 1.25rem 1.25rem',
              borderTop: '1px solid rgba(212, 175, 55, 0.15)'
            }}>

              {/* Vinho da Garrafeira */}
              {p.vinho_garrafeira && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Wine size={14} style={{ color: gold }} />
                    <span style={{ fontFamily: 'Playfair Display, serif', color: gold, fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Da tua Garrafeira
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Lora, serif', color: '#f5deb3', fontSize: '0.85rem', margin: 0 }}>
                    {p.vinho_garrafeira.nome} {p.vinho_garrafeira.ano && `(${p.vinho_garrafeira.ano})`}
                  </p>
                </div>
              )}

              {/* Recomendação IA */}
              {p.vinho_ideal && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(212, 175, 55, 0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>🤖</span>
                    <span style={{ fontFamily: 'Playfair Display, serif', color: gold, fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Sugestão IA
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'Lora, serif',
                    color: 'rgba(253, 230, 138, 0.7)',
                    fontSize: '0.8rem',
                    margin: 0,
                    lineHeight: '1.6',
                    // Mostrar só as primeiras 3 linhas
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {p.vinho_ideal}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Total */}
      {!loading && pratosFiltrados.length > 0 && (
        <p style={{ textAlign: 'center', fontFamily: 'Lora, serif', color: muted, fontSize: '0.8rem', marginTop: '1rem' }}>
          {pratosFiltrados.length} refeição{pratosFiltrados.length !== 1 ? 'ões' : ''} no histórico
        </p>
      )}
    </div>
  )
}
