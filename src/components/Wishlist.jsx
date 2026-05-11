import React, { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, Bookmark } from 'lucide-react'
import { adicionarAWishlist, listarWishlist, marcarComoComprado, removerDaWishlist, obterEstatisticasWishlist } from '../services/fbWishlist'

export default function Wishlist({ userId }) {
  const [wishlist, setWishlist] = useState([])
  const [comprados, setComprados] = useState([])
  const [stats, setStats] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [aba, setAba] = useState('wishlist')

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'tinto',
    regiao: '',
    ano: '',
    preco: '',
    descricao: '',
    fonte: 'restaurante',
    local: '',
    recomendadoPor: '',
    notas: ''
  })

  useEffect(() => {
    carregarWishlist()
  }, [userId])

  const carregarWishlist = async () => {
    setLoading(true)
    try {
      const [wishlistData, compradosData, statsData] = await Promise.all([
        listarWishlist(userId, 'wishlist'),
        listarWishlist(userId, 'comprado'),
        obterEstatisticasWishlist(userId)
      ])
      setWishlist(wishlistData)
      setComprados(compradosData)
      setStats(statsData)
    } catch (err) {
      setError('Erro ao carregar wishlist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdicionarAWishlist = async () => {
    if (!formData.nome.trim()) {
      setError('Nome do vinho é obrigatório')
      return
    }

    setLoading(true)
    try {
      await adicionarAWishlist(userId, formData)
      setFormData({
        nome: '',
        tipo: 'tinto',
        regiao: '',
        ano: '',
        preco: '',
        descricao: '',
        fonte: 'restaurante',
        local: '',
        recomendadoPor: '',
        notas: ''
      })
      setMostrarForm(false)
      setError(null)
      await carregarWishlist()
    } catch (err) {
      setError('Erro ao adicionar à wishlist')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarComoComprado = async (itemId) => {
    try {
      await marcarComoComprado(userId, itemId)
      await carregarWishlist()
    } catch (err) {
      setError('Erro ao atualizar status')
      console.error(err)
    }
  }

  const handleRemover = async (itemId) => {
    if (!window.confirm('Remover da wishlist?')) return

    try {
      await removerDaWishlist(userId, itemId)
      await carregarWishlist()
    } catch (err) {
      setError('Erro ao remover')
      console.error(err)
    }
  }

  const itens = aba === 'wishlist' ? wishlist : comprados

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '40px' }} className="font-bold mb-2">
          Wishlist
        </h1>
        <p className="text-amber-100/70">Descobre e coleciona novos vinhos</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Na Wishlist</div>
            <div className="text-white text-2xl font-bold">{stats.na_wishlist}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Comprados</div>
            <div className="text-white text-2xl font-bold">{stats.comprados}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Taxa de Compra</div>
            <div className="text-white text-2xl font-bold">{stats.taxa_conversao}%</div>
          </div>
        </div>
      )}

      {/* Abas */}
      <div className="mb-8 flex gap-2 border-b border-amber-600/30">
        <button
          onClick={() => setAba('wishlist')}
          className="px-4 py-3 font-semibold transition relative"
          style={{ color: aba === 'wishlist' ? '#d4af37' : '#d4af37/50' }}
        >
          📌 Na Wishlist ({wishlist.length})
          {aba === 'wishlist' && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: '#d4af37' }} />
          )}
        </button>
        <button
          onClick={() => setAba('comprado')}
          className="px-4 py-3 font-semibold transition relative"
          style={{ color: aba === 'comprado' ? '#d4af37' : '#d4af37/50' }}
        >
          ✅ Comprados ({comprados.length})
          {aba === 'comprado' && (
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: '#d4af37' }} />
          )}
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="mb-8 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        style={{ background: '#d4af37', color: '#1a0e0e' }}
      >
        <Plus size={20} />
        Adicionar à Wishlist
      </button>

      {/* Add Form */}
      {mostrarForm && (
        <div className="mb-8 p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h2 className="text-xl font-bold text-amber-300 mb-6">Novo Vinho na Wishlist</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome do vinho"
              value={formData.nome}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
            >
              <option value="tinto">Tinto</option>
              <option value="branco">Branco</option>
              <option value="rosé">Rosé</option>
            </select>
            <input
              type="text"
              name="regiao"
              placeholder="Região"
              value={formData.regiao}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
            <input
              type="number"
              name="preco"
              placeholder="Preço aproximado"
              value={formData.preco}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
            <select
              name="fonte"
              value={formData.fonte}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
            >
              <option value="restaurante">Restaurante</option>
              <option value="amigo">Amigo</option>
              <option value="critica">Crítica</option>
              <option value="internet">Internet</option>
              <option value="outro">Outro</option>
            </select>
            <input
              type="text"
              name="local"
              placeholder="Onde viste (restaurante/loja)"
              value={formData.local}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
          </div>

          <textarea
            name="descricao"
            placeholder="Descrição/motivo"
            value={formData.descricao}
            onChange={handleFormChange}
            className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50 mb-4"
            rows="3"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdicionarAWishlist}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded bg-amber-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
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

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-600 text-red-200">
          {error}
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="text-center text-amber-200">Carregando...</div>
      ) : itens.length === 0 ? (
        <div className="text-center text-amber-200/50 py-12">
          {aba === 'wishlist'
            ? 'Nenhum vinho na wishlist. Adiciona algum! 📌'
            : 'Nenhum vinho comprado ainda. 🍷'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itens.map(item => (
            <div
              key={item.id}
              className="p-6 rounded-lg"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-amber-300">{item.nome}</h3>
                  <p className="text-xs text-amber-100/50">{item.regiao} {item.ano && `(${item.ano})`}</p>
                </div>
                <Bookmark size={20} className="text-amber-600" fill="#d4af37" />
              </div>

              {item.local && <p className="text-xs text-amber-200/70 mb-2">📍 {item.local}</p>}
              {item.recomendadoPor && <p className="text-xs text-amber-200/70 mb-2">👤 {item.recomendadoPor}</p>}
              {item.preco_aproximado && <p className="text-amber-600 font-semibold mb-3">€{item.preco_aproximado}</p>}

              {item.descricao && <p className="text-xs text-amber-100/70 mb-3">{item.descricao}</p>}

              <div className="flex gap-2">
                {aba === 'wishlist' && (
                  <button
                    onClick={() => handleMarcarComoComprado(item.id)}
                    className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-green-900/20 text-green-300 hover:bg-green-900/40 transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    Comprei
                  </button>
                )}
                <button
                  onClick={() => handleRemover(item.id)}
                  className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-red-900/20 text-red-300 hover:bg-red-900/40 transition flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
