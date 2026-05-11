import React, { useState, useEffect } from 'react'
import { Eye, AlertCircle } from 'lucide-react'
import { listarGarrafeira } from '../services/fbGarrafeira'
import { criarPerfilSabor, calcularCompatibilidade, obterPrevisaoBebida, gerarAlertas } from '../services/analiseVinho'

export default function AnaliseVisual({ userId }) {
  const [garrafeira, setGarrafeira] = useState([])
  const [vinhoSelecionado, setVinhoSelecionado] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [previsao, setPrevisao] = useState(null)
  const [alertas, setAlertas] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarGarrafeira()
  }, [userId])

  const carregarGarrafeira = async () => {
    setLoading(true)
    try {
      const vinhos = await listarGarrafeira(userId)
      setGarrafeira(vinhos)
      if (vinhos.length > 0) {
        selecionarVinho(vinhos[0])
        gerarAlertas(vinhos)
      }
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const selecionarVinho = (vinho) => {
    setVinhoSelecionado(vinho)
    const perfilData = criarPerfilSabor(vinho)
    setPerfil(perfilData)
    const previsaoData = obterPrevisaoBebida(vinho)
    setPrevisao(previsaoData)
  }

  const renderRadar = () => {
    if (!perfil) return null

    const valores = Object.values(perfil)
    const max = 100
    const pontos = Object.entries(perfil).map(([chave, valor], i) => {
      const angulo = (i / 6) * 2 * Math.PI - Math.PI / 2
      const raio = (valor / max) * 80
      const x = 100 + raio * Math.cos(angulo)
      const y = 100 + raio * Math.sin(angulo)
      return { chave, valor, x, y, angulo }
    })

    const caminhoPerfil = pontos.map((p, i) => `${p.x},${p.y}`).join(' L ') + ' Z'

    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto" style={{ background: 'rgba(212, 175, 55, 0.05)', borderRadius: '8px' }}>
        {/* Grid */}
        {[20, 40, 60, 80, 100].map(r => (
          <circle
            key={`grid-${r}`}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)"
            strokeWidth="0.5"
          />
        ))}

        {/* Linhas */}
        {pontos.map((p, i) => (
          <line
            key={`line-${i}`}
            x1="100"
            y1="100"
            x2={100 + 100 * Math.cos(p.angulo)}
            y2={100 + 100 * Math.sin(p.angulo)}
            stroke="rgba(212, 175, 55, 0.1)"
            strokeWidth="0.5"
          />
        ))}

        {/* Perfil */}
        <polygon
          points={caminhoPerfil}
          fill="rgba(212, 175, 55, 0.3)"
          stroke="#d4af37"
          strokeWidth="2"
        />

        {/* Labels */}
        {pontos.map((p, i) => {
          const labelAngulo = (i / 6) * 2 * Math.PI - Math.PI / 2
          const labelRaio = 110
          const labelX = 100 + labelRaio * Math.cos(labelAngulo)
          const labelY = 100 + labelRaio * Math.sin(labelAngulo)
          return (
            <text
              key={`label-${i}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dy="0.3em"
              fontSize="10"
              fill="#d4af37"
              fontWeight="bold"
            >
              {p.chave.charAt(0).toUpperCase() + p.chave.slice(1)}
              <tspan x={labelX} dy="1.2em" fontSize="9" fill="#d4af37/70">
                {p.valor}
              </tspan>
            </text>
          )
        })}
      </svg>
    )
  }

  const getStatusColor = (status) => {
    if (status.includes('pico') || status.includes('perfeito') || status.includes('ideal')) return '#4CAF50'
    if (status.includes('jovem') || status.includes('guardar')) return '#FFC107'
    if (status.includes('urgente') || status.includes('risco')) return '#F44336'
    return '#2196F3'
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '40px' }} className="font-bold mb-2">
          Análise Visual de Sabor
        </h1>
        <p className="text-amber-100/70">Explora o perfil gustativo dos teus vinhos</p>
      </div>

      {/* Seletor */}
      <div className="mb-8">
        <label className="block text-amber-300 font-semibold mb-3">Seleciona um vinho</label>
        <select
          value={vinhoSelecionado?.id || ''}
          onChange={(e) => {
            const vinho = garrafeira.find(v => v.id === e.target.value)
            if (vinho) selecionarVinho(vinho)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar */}
          <div className="p-8 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <h2 className="text-amber-300 font-bold text-lg mb-6 text-center">Perfil de Sabor</h2>
            {renderRadar()}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Vinho Info */}
            <div className="p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '24px' }} className="font-bold mb-2">
                {vinhoSelecionado.nome}
              </h3>
              <p className="text-amber-100/70">{vinhoSelecionado.regiao} {vinhoSelecionado.ano}</p>
              {vinhoSelecionado.castas?.length > 0 && (
                <p className="text-amber-100/70 text-sm mt-2">
                  Castas: {vinhoSelecionado.castas.join(', ')}
                </p>
              )}
            </div>

            {/* Previsão de Bebida */}
            {previsao && (
              <div
                className="p-6 rounded-lg border"
                style={{
                  background: `${getStatusColor(previsao.status)}15`,
                  borderColor: `${getStatusColor(previsao.status)}50`
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle size={20} style={{ color: getStatusColor(previsao.status) }} />
                  <div>
                    <h3 className="font-bold" style={{ color: getStatusColor(previsao.status) }}>
                      {previsao.status.replace(/-/g, ' ').toUpperCase()}
                    </h3>
                    <p className="text-sm text-white mt-1">{previsao.mensagem}</p>
                  </div>
                </div>
                <div className="text-sm text-white/80">
                  <p>
                    <strong>Recomendação:</strong> {previsao.recomendacao}
                  </p>
                  {previsao.idade_atual !== undefined && (
                    <p className="mt-2">
                      Idade atual: {previsao.idade_atual} ano(s)
                      <br />
                      Ideal para beber: {previsao.ideal_minimo}-{previsao.ideal_maximo} ano(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Descrição */}
            {vinhoSelecionado.descricao && (
              <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <h4 className="text-amber-300 font-bold mb-2">Descrição</h4>
                <p className="text-amber-100/80 text-sm">{vinhoSelecionado.descricao}</p>
              </div>
            )}

            {/* Escala de Características */}
            {perfil && (
              <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <h4 className="text-amber-300 font-bold mb-4">Características Detalhadas</h4>
                <div className="space-y-3">
                  {Object.entries(perfil).map(([chave, valor]) => (
                    <div key={chave}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-amber-200 text-sm font-semibold">
                          {chave.charAt(0).toUpperCase() + chave.slice(1)}
                        </span>
                        <span className="text-amber-600 text-sm">{valor}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            background: '#d4af37',
                            width: `${valor}%`,
                            opacity: 0.7
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alertas Globais */}
      {alertas && (alertas.beber_urgente.length > 0 || alertas.no_pico.length > 0) && (
        <div className="mt-12">
          <h2 className="text-amber-300 font-bold text-lg mb-6">⚠️ Alertas de Bebida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alertas.beber_urgente.length > 0 && (
              <div className="p-6 rounded-lg" style={{ background: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
                <h3 className="text-red-400 font-bold mb-4">🔴 Beber em Breve!</h3>
                <div className="space-y-2">
                  {alertas.beber_urgente.map((item, i) => (
                    <p key={i} className="text-red-200 text-sm">{item.vinho}</p>
                  ))}
                </div>
              </div>
            )}

            {alertas.no_pico.length > 0 && (
              <div className="p-6 rounded-lg" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                <h3 className="text-green-400 font-bold mb-4">🟢 No Pico!</h3>
                <div className="space-y-2">
                  {alertas.no_pico.map((item, i) => (
                    <p key={i} className="text-green-200 text-sm">{item.vinho} - {item.mensagem}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
