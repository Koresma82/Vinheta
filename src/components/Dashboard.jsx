import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Wine, Target } from 'lucide-react'
import { obterEstatisticasGarrafeira, listarGarrafeira } from '../services/fbGarrafeira'
import { obterEstatisticasGlobaisProvas } from '../services/fbNotasProva'
import { obterEstatisticas as obterEstatisticasHistorico } from '../services/fbHistoricoPratos'
import { obterEstatisticasWishlist } from '../services/fbWishlist'

export default function Dashboard({ userId }) {
  const [garrafeiraStats, setGarrafeiraStats] = useState(null)
  const [provasStats, setProvasStats] = useState(null)
  const [historicoStats, setHistoricoStats] = useState(null)
  const [wishlistStats, setWishlistStats] = useState(null)
  const [garrafeira, setGarrafeira] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [userId])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [garrafeiraData, provasData, historicoData, wishlistData, garrafeiraList] = await Promise.all([
        obterEstatisticasGarrafeira(userId),
        obterEstatisticasGlobaisProvas(userId),
        obterEstatisticasHistorico(userId),
        obterEstatisticasWishlist(userId),
        listarGarrafeira(userId)
      ])

      setGarrafeiraStats(garrafeiraData)
      setProvasStats(provasData)
      setHistoricoStats(historicoData)
      setWishlistStats(wishlistData)
      setGarrafeira(garrafeiraList)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
        <div className="text-amber-200">Carregando dados...</div>
      </div>
    )
  }

  // Estatísticas por tipo
  const distribuicaoTipo = [
    { tipo: 'Tinto', qtd: garrafeiraStats?.por_tipo.tinto || 0, cor: '#8b3a3a' },
    { tipo: 'Branco', qtd: garrafeiraStats?.por_tipo.branco || 0, cor: '#d4af37' },
    { tipo: 'Rosé', qtd: garrafeiraStats?.por_tipo.rosé || 0, cor: '#c97e9e' }
  ]

  const maxQtd = Math.max(...distribuicaoTipo.map(d => d.qtd), 1)

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #1a0e0e 0%, #2d1b1b 100%)' }}>
      {/* Header */}
      <div className="mb-12">
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '40px' }} className="font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-amber-100/70">Análise completa da tua coleção de vinhos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Garrafeira */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-300 font-semibold">Garrafeira</h3>
            <Wine size={24} className="text-amber-600" />
          </div>
          <div className="text-white text-3xl font-bold mb-2">{garrafeiraStats?.total || 0}</div>
          <p className="text-amber-100/70 text-sm">Garrafas: {garrafeiraStats?.quantidade_total || 0}</p>
          <p className="text-amber-100/70 text-sm">Valor: €{garrafeiraStats?.valor_total.toFixed(0) || 0}</p>
        </div>

        {/* Provas */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-300 font-semibold">Provas</h3>
            <BarChart3 size={24} className="text-amber-600" />
          </div>
          <div className="text-white text-3xl font-bold mb-2">{provasStats?.total_provas || 0}</div>
          <p className="text-amber-100/70 text-sm">Rating: {provasStats?.rating_medio_global || 0}/5</p>
          <p className="text-amber-100/70 text-sm">Vinhos provados: {provasStats?.vinhos_provados || 0}</p>
        </div>

        {/* Histórico */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-300 font-semibold">Histórico</h3>
            <TrendingUp size={24} className="text-amber-600" />
          </div>
          <div className="text-white text-3xl font-bold mb-2">{historicoStats?.cache_hits || 0}</div>
          <p className="text-amber-100/70 text-sm">Cache hits (economia)</p>
          <p className="text-green-400 text-sm font-semibold">Poupou €{historicoStats?.custo_poupado?.toFixed(2) || '0'}</p>
        </div>

        {/* Wishlist */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-300 font-semibold">Wishlist</h3>
            <Target size={24} className="text-amber-600" />
          </div>
          <div className="text-white text-3xl font-bold mb-2">{wishlistStats?.na_wishlist || 0}</div>
          <p className="text-amber-100/70 text-sm">Comprados: {wishlistStats?.comprados || 0}</p>
          <p className="text-amber-100/70 text-sm">Taxa: {wishlistStats?.taxa_conversao || 0}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Distribuição por Tipo */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h3 className="text-amber-300 font-bold text-lg mb-6">Distribuição por Tipo</h3>
          <div className="space-y-4">
            {distribuicaoTipo.map(item => (
              <div key={item.tipo}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-200">{item.tipo}</span>
                  <span className="text-amber-600 font-bold">{item.qtd}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      background: item.cor,
                      width: `${(item.qtd / maxQtd) * 100}%`,
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regiões */}
        <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <h3 className="text-amber-300 font-bold text-lg mb-6">Top Regiões</h3>
          <div className="space-y-3">
            {garrafeira.length > 0 ? (
              Object.entries(
                garrafeira.reduce((acc, v) => {
                  acc[v.regiao] = (acc[v.regiao] || 0) + 1
                  return acc
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([regiao, qtd]) => (
                  <div key={regiao} className="flex justify-between items-center">
                    <span className="text-amber-200">{regiao}</span>
                    <span className="px-3 py-1 rounded bg-amber-600/20 text-amber-300 font-semibold">
                      {qtd}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-amber-100/50">Sem dados</p>
            )}
          </div>
        </div>
      </div>

      {/* Economy Stats */}
      <div className="p-6 rounded-lg" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
        <h3 className="text-green-400 font-bold text-lg mb-6">💰 Economia de API</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-green-400 text-sm font-semibold mb-2">Chamadas Totais</div>
            <div className="text-white text-3xl font-bold">{historicoStats?.chamadas_totais || 0}</div>
            <p className="text-green-200/70 text-xs mt-1">Recomendações processadas</p>
          </div>
          <div>
            <div className="text-green-400 text-sm font-semibold mb-2">Cache Hits</div>
            <div className="text-white text-3xl font-bold">{historicoStats?.cache_hits || 0}</div>
            <div className="text-green-400 text-xs font-semibold mt-1">
              {historicoStats?.economia_percentual || 0}% economia
            </div>
          </div>
          <div>
            <div className="text-green-400 text-sm font-semibold mb-2">Poupado</div>
            <div className="text-green-400 text-3xl font-bold">€{historicoStats?.custo_poupado?.toFixed(2) || '0'}</div>
            <p className="text-green-200/70 text-xs mt-1">Vs total sem cache: €{historicoStats?.custo_estimado?.toFixed(2) || '0'}</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-12 p-6 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        <h3 className="text-amber-300 font-bold text-lg mb-6">📊 Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {garrafeiraStats && (
            <>
              <div className="p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                <p className="text-amber-200">
                  <strong>Coleção Valiosa:</strong> A tua garrafeira vale aproximadamente €{garrafeiraStats.valor_total.toFixed(0)}.
                </p>
              </div>
              <div className="p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                <p className="text-amber-200">
                  <strong>Diversidade:</strong> Tens {garrafeiraStats.regioes} regiões diferentes e {garrafeiraStats.castas_unicas} castas únicas.
                </p>
              </div>
            </>
          )}
          {provasStats && (
            <div className="p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
              <p className="text-amber-200">
                <strong>Experiência:</strong> Já provaste {provasStats.vinhos_provados} vinhos com rating médio de {provasStats.rating_medio_global}/5.
              </p>
            </div>
          )}
          {historicoStats && historicoStats.economia_percentual > 0 && (
            <div className="p-3 rounded" style={{ background: 'rgba(76, 175, 80, 0.05)' }}>
              <p className="text-green-300">
                <strong>Eficiência:</strong> {historicoStats.economia_percentual}% das recomendações foram do cache (sem custo API)!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
