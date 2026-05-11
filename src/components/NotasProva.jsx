import React, { useState, useEffect } from 'react'
import { Plus, Star, Trash2, Calendar, MessageCircle } from 'lucide-react'
import { registarNovaProva, listarProvas, removerProva, obterEstatisticasProvas } from '../services/fbNotasProva'
import { listarGarrafeira } from '../services/fbGarrafeira'

const SENTIMENTOS = ['Surpreendido', 'Feliz', 'Satisfeito', 'Decepcionado', 'Excelente', 'Harmonioso', 'Elegante', 'Robusto']

export default function NotasProva({ userId }) {
  const [garrafeira, setGarrafeira] = useState([])
  const [vinhoSelecionado, setVinhoSelecionado] = useState(null)
  const [provas, setProvas] = useState([])
  const [stats, setStats] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    rating: 3,
    data: new Date().toISOString().split('T')[0],
    temperatura: '',
    prato: '',
    acompanhia: '',
    notas: '',
    sentimentos: []
  })

  useEffect(() => {
    carregarGarrafeira()
  }, [userId])

  useEffect(() => {
    if (vinhoSelecionado) {
      carregarProvas()
    }
  }, [vinhoSelecionado])

  const carregarGarrafeira = async () => {
    try {
      const vinhos = await listarGarrafeira(userId)
      setGarrafeira(vinhos)
    } catch (err) {
      setError('Erro ao carregar garrafeira')
      console.error(err)
    }
  }

  const carregarProvas = async () => {
    if (!vinhoSelecionado) return
    try {
      const provasData = await listarProvas(userId, vinhoSelecionado.id)
      setProvas(provasData)
      const statsData = await obterEstatisticasProvas(userId, vinhoSelecionado.id)
      setStats(statsData)
    } catch (err) {
      setError('Erro ao carregar provas')
      console.error(err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  const handleSentimentoToggle = (sentimento) => {
    setFormData(prev => ({
      ...prev,
      sentimentos: prev.sentimentos.includes(sentimento)
        ? prev.sentimentos.filter(s => s !== sentimento)
        : [...prev.sentimentos, sentimento]
    }))
  }

  const handleRegistarProva = async () => {
    if (!vinhoSelecionado) {
      setError('Seleciona um vinho')
      return
    }

    setLoading(true)
    try {
      await registarNovaProva(userId, vinhoSelecionado.id, formData)
      setFormData({
        rating: 3,
        data: new Date().toISOString().split('T')[0],
        temperatura: '',
        prato: '',
        acompanhia: '',
        notas: '',
        sentimentos: []
      })
      setMostrarForm(false)
      setError(null)
      await carregarProvas()
    } catch (err) {
      setError('Erro ao registar prova')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoverProva = async (provaId) => {
    if (!window.confirm('Remover prova?')) return

    try {
      await removerProva(userId, vinhoSelecionado.id, provaId)
      await carregarProvas()
    } catch (err) {
      setError('Erro ao remover prova')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '40px' }} className="font-bold mb-2">
          Notas de Prova
        </h1>
        <p className="text-amber-100/70">Regista e analisa as tuas degustações</p>
      </div>

      {/* Selecionar Vinho */}
      <div className="mb-8">
        <label className="block text-amber-300 font-semibold mb-3">Seleciona um vinho</label>
        <select
          value={vinhoSelecionado?.id || ''}
          onChange={(e) => {
            const vinho = garrafeira.find(v => v.id === e.target.value)
            setVinhoSelecionado(vinho || null)
          }}
          className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
        >
          <option value="">-- Escolhe um vinho --</option>
          {garrafeira.map(vinho => (
            <option key={vinho.id} value={vinho.id}>
              {vinho.nome} ({vinho.ano})
            </option>
          ))}
        </select>
      </div>

      {vinhoSelecionado && (
        <>
          {/* Vinho Info */}
          <div className="mb-8 p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '24px' }} className="font-bold mb-2">
              {vinhoSelecionado.nome}
            </h2>
            <p className="text-amber-100/70">{vinhoSelecionado.regiao} {vinhoSelecionado.ano}</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <div className="text-amber-600 text-sm font-semibold">Total Provas</div>
                <div className="text-white text-2xl font-bold">{stats.total}</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <div className="text-amber-600 text-sm font-semibold">Rating Médio</div>
                <div className="text-white text-2xl font-bold">{stats.rating_medio}/5</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <div className="text-amber-600 text-sm font-semibold">Temperatura Ideal</div>
                <div className="text-white text-2xl font-bold">{stats.temperatura_ideal || '--'}°C</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <div className="text-amber-600 text-sm font-semibold">Melhor Com</div>
                <div className="text-white text-sm font-bold truncate">{stats.prato_ideal || '--'}</div>
              </div>
            </div>
          )}

          {/* Add Button */}
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="mb-8 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            style={{ background: '#d4af37', color: '#1a0e0e' }}
          >
            <Plus size={20} />
            Registar Nova Prova
          </button>

          {/* Add Form */}
          {mostrarForm && (
            <div className="mb-8 p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <h2 className="text-xl font-bold text-amber-300 mb-6">Nova Prova</h2>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-amber-300 font-semibold mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="transition transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= formData.rating ? 'text-amber-600' : 'text-gray-600'}
                        fill={star <= formData.rating ? '#d4af37' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-amber-300 font-semibold mb-2">Data</label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-amber-300 font-semibold mb-2">Temperatura (°C)</label>
                  <input
                    type="number"
                    name="temperatura"
                    placeholder="Ex: 16"
                    value={formData.temperatura}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-semibold mb-2">Prato</label>
                  <input
                    type="text"
                    name="prato"
                    placeholder="Ex: Bacalhau"
                    value={formData.prato}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-amber-300 font-semibold mb-2">Acompanhia</label>
                <input
                  type="text"
                  name="acompanhia"
                  placeholder="Ex: Jantar com amigos"
                  value={formData.acompanhia}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
                />
              </div>

              {/* Sentimentos */}
              <div className="mb-6">
                <label className="block text-amber-300 font-semibold mb-3">Sentimentos</label>
                <div className="flex flex-wrap gap-2">
                  {SENTIMENTOS.map(sentimento => (
                    <button
                      key={sentimento}
                      onClick={() => handleSentimentoToggle(sentimento)}
                      className="px-3 py-1 rounded text-sm font-semibold transition"
                      style={{
                        background: formData.sentimentos.includes(sentimento) ? '#d4af37' : 'rgba(212, 175, 55, 0.1)',
                        color: formData.sentimentos.includes(sentimento) ? '#1a0e0e' : '#d4af37',
                        border: `1px solid ${formData.sentimentos.includes(sentimento) ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`
                      }}
                    >
                      {sentimento}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-amber-300 font-semibold mb-2">Notas</label>
                <textarea
                  name="notas"
                  placeholder="Ex: Sabores... Aromas... Taninos..."
                  value={formData.notas}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
                  rows="4"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRegistarProva}
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded bg-amber-600 text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Prova'}
                </button>
                <button
                  onClick={() => setMostrarForm(false)}
                  className="flex-1 px-4 py-2 rounded bg-gray-600 text-white font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Provas List */}
          <div>
            <h3 className="text-xl font-bold text-amber-300 mb-4">Histórico de Provas</h3>
            {provas.length === 0 ? (
              <div className="text-center text-amber-200/50 py-8">
                Nenhuma prova registada. Regista a primeira! 📝
              </div>
            ) : (
              <div className="space-y-4">
                {provas.map(prova => (
                  <div
                    key={prova.id}
                    className="p-4 rounded-lg"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= prova.rating ? 'text-amber-600' : 'text-gray-600'}
                            fill={star <= prova.rating ? '#d4af37' : 'none'}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => handleRemoverProva(prova.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-amber-200/70 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(prova.data?.toDate?.() || prova.data).toLocaleDateString('pt-PT')}
                      </span>
                      {prova.temperatura && <span>🌡️ {prova.temperatura}°C</span>}
                      {prova.prato_acompanhamento && <span>🍽️ {prova.prato_acompanhamento}</span>}
                    </div>

                    {prova.sentimentos?.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {prova.sentimentos.map(s => (
                          <span key={s} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {prova.notas_texto && (
                      <p className="text-sm text-amber-100/80 flex items-start gap-2">
                        <MessageCircle size={14} className="mt-1 flex-shrink-0" />
                        {prova.notas_texto}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 p-3 rounded bg-red-900/30 border border-red-600 text-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
