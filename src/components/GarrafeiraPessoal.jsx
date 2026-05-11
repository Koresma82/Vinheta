import React, { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Star, Droplet } from 'lucide-react'
import { adicionarVinho, listarGarrafeira, atualizarQuantidade, removerVinho, obterEstatisticasGarrafeira } from '../services/fbGarrafeira'

export default function GarrafeiraPessoal({ userId }) {
  const [garrafeira, setGarrafeira] = useState([])
  const [filtro, setFiltro] = useState('todos')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [imagemBase64, setImagemBase64] = useState(null)
  const [imagemPreview, setImagemPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'tinto',
    regiao: '',
    ano: new Date().getFullYear(),
    castas: [],
    descricao: '',
    preco: 0,
    alcool: '',
    temperatura: '',
    quantidade: 1,
    notas: ''
  })

  useEffect(() => {
    carregarGarrafeira()
  }, [userId])

  const carregarGarrafeira = async () => {
    setLoading(true)
    try {
      const vinhos = await listarGarrafeira(userId, filtro === 'todos' ? null : filtro)
      setGarrafeira(vinhos)
      const statsData = await obterEstatisticasGarrafeira(userId)
      setStats(statsData)
    } catch (err) {
      setError('Erro ao carregar garrafeira')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagemBase64(event.target?.result)
      setImagemPreview(event.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'castas') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(c => c.trim()).filter(c => c)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'quantidade' || name === 'preco' || name === 'ano' ? parseFloat(value) || 0 : value
      }))
    }
  }

  const handleAdicionarVinho = async () => {
    if (!formData.nome.trim()) {
      setError('Nome do vinho é obrigatório')
      return
    }

    setLoading(true)
    try {
      await adicionarVinho(userId, {
        ...formData,
        imagemBase64: imagemBase64
      })
      setFormData({
        nome: '',
        tipo: 'tinto',
        regiao: '',
        ano: new Date().getFullYear(),
        castas: [],
        descricao: '',
        preco: 0,
        alcool: '',
        temperatura: '',
        quantidade: 1,
        notas: ''
      })
      setImagemBase64(null)
      setImagemPreview(null)
      setMostrarForm(false)
      setError(null)
      await carregarGarrafeira()
    } catch (err) {
      setError('Erro ao adicionar vinho')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAtualizarQuantidade = async (vinhoId, novaQtd) => {
    try {
      await atualizarQuantidade(userId, vinhoId, novaQtd)
      await carregarGarrafeira()
    } catch (err) {
      setError('Erro ao atualizar quantidade')
      console.error(err)
    }
  }

  const handleRemoverVinho = async (vinhoId) => {
    if (!window.confirm('Tem a certeza que quer remover este vinho?')) return

    setLoading(true)
    try {
      await removerVinho(userId, vinhoId)
      await carregarGarrafeira()
    } catch (err) {
      setError('Erro ao remover vinho')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const vinhosFiltrados = filtro === 'todos' ? garrafeira : garrafeira.filter(v => v.tipo === filtro)

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '40px' }} className="font-bold mb-2">
          Garrafeira Pessoal
        </h1>
        <p className="text-amber-100/70">Coleciona e gere os teus vinhos</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Total</div>
            <div className="text-white text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Garrafas</div>
            <div className="text-white text-2xl font-bold">{stats.quantidade_total}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Valor</div>
            <div className="text-white text-2xl font-bold">€{stats.valor_total.toFixed(0)}</div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="text-amber-600 text-sm font-semibold">Rating</div>
            <div className="text-white text-2xl font-bold">{stats.rating_medio}/5</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {['todos', 'tinto', 'branco', 'rosé'].map(tipo => (
          <button
            key={tipo}
            onClick={() => {
              setFiltro(tipo)
              carregarGarrafeira()
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: filtro === tipo ? '#d4af37' : 'rgba(212, 175, 55, 0.1)',
              color: filtro === tipo ? '#1a0e0e' : '#d4af37',
              border: `1px solid ${filtro === tipo ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`
            }}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="mb-8 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        style={{ background: '#d4af37', color: '#1a0e0e' }}
      >
        <Plus size={20} />
        Adicionar Vinho
      </button>

      {/* Add Form */}
      {mostrarForm && (
        <div className="mb-8 p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h2 className="text-xl font-bold text-amber-300 mb-6">Novo Vinho</h2>

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
              name="ano"
              placeholder="Ano"
              value={formData.ano}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
            />
            <input
              type="text"
              name="castas"
              placeholder="Castas (separadas por vírgula)"
              value={formData.castas.join(', ')}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
            <input
              type="number"
              name="preco"
              placeholder="Preço aproximado"
              value={formData.preco}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
            />
            <input
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              value={formData.quantidade}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white"
            />
            <input
              type="text"
              name="alcool"
              placeholder="Álcool %"
              value={formData.alcool}
              onChange={handleFormChange}
              className="px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50"
            />
          </div>

          <textarea
            name="descricao"
            placeholder="Descrição do vinho"
            value={formData.descricao}
            onChange={handleFormChange}
            className="w-full px-4 py-2 rounded bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50 mb-4"
            rows="3"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 border-2 border-dashed border-amber-600/50 rounded-lg p-4 text-center cursor-pointer"
            style={{ background: 'rgba(217, 119, 6, 0.05)' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagemPreview ? (
              <img src={imagemPreview} alt="Preview" className="h-20 mx-auto rounded" />
            ) : (
              <p className="text-amber-200 text-sm">Clica para adicionar foto da garrafa</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdicionarVinho}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded bg-amber-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
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

      {/* Vinhos List */}
      {loading ? (
        <div className="text-center text-amber-200">Carregando...</div>
      ) : vinhosFiltrados.length === 0 ? (
        <div className="text-center text-amber-200/50 py-12">
          Nenhum vinho na garrafeira. Adiciona o teu primeiro vinho! 🍷
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vinhosFiltrados.map(vinho => (
            <div
              key={vinho.id}
              className="rounded-lg overflow-hidden transition hover:scale-105"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              {vinho.imagem_url && (
                <img
                  src={vinho.imagem_url}
                  alt={vinho.nome}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-amber-300">{vinho.nome}</h3>
                    <p className="text-xs text-amber-100/50">{vinho.regiao} {vinho.ano}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-600" fill="#d4af37" />
                    <span className="text-amber-300 text-sm">{vinho.rating_medio.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-amber-100/70 mb-3">{vinho.descricao}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-amber-600 font-semibold">€{vinho.preco_aproximado}</span>
                  <div className="flex items-center gap-2">
                    <Droplet size={14} className="text-amber-600" />
                    <input
                      type="number"
                      min="0"
                      value={vinho.quantidade}
                      onChange={(e) => handleAtualizarQuantidade(vinho.id, parseInt(e.target.value))}
                      className="w-12 px-2 py-1 rounded bg-white/10 border border-amber-600/30 text-white text-sm text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-amber-600/20 text-amber-300 hover:bg-amber-600/40 transition flex items-center justify-center gap-1"
                  >
                    <Edit2 size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemoverVinho(vinho.id)}
                    className="flex-1 px-3 py-2 rounded text-xs font-semibold bg-red-900/20 text-red-300 hover:bg-red-900/40 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
