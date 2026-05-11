import React, { useState, useRef } from 'react'
import { Upload, Sparkles, Wine, TrendingUp } from 'lucide-react'
import {
  procurarPratoHistorico,
  guardarSugestao
} from '../services/fbHistoricoPratos'
import { procurarMatchGarrafeira, listarGarrafeira } from '../services/fbGarrafeira'

export default function WinePairingForm({ userId }) {
  const [dish, setDish] = useState('')
  const [budgetMin, setBudgetMin] = useState(10)
  const [budgetMax, setBudgetMax] = useState(30)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [error, setError] = useState(null)
  const [fromCache, setFromCache] = useState(false)
  const [stats, setStats] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setImage(base64)
      setImagePreview(event.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const analyzeWinePairing = async () => {
    if (!dish.trim()) {
      setError('Por favor, escreve o prato que vais comer')
      return
    }

    setLoading(true)
    setError(null)
    setRecommendation(null)
    setFromCache(false)

    try {
      // PASSO 1: PROCURAR NO HISTÓRICO (CACHE)
      console.log('🔍 Procurando no histórico...')
      const pratoHistorico = await procurarPratoHistorico(userId, dish, {
        min: budgetMin,
        max: budgetMax
      })

      if (pratoHistorico) {
        // 🎉 CACHE HIT!
        console.log('✅ Cache hit! Sugestão do histórico')
        setRecommendation(pratoHistorico)
        setFromCache(true)
        setLoading(false)
        return
      }

      // PASSO 2: CACHE MISS - Procurar na garrafeira
      console.log('📊 Procurando na garrafeira...')
      const garrafeira = await listarGarrafeira(userId)
      const matchGarrafeira = await procurarMatchGarrafeira(userId, 'branco')

      // PASSO 3: Chamar Claude API (COM CUSTO)
      console.log('🤖 Chamando Claude API...')
      let wineList = ''

      if (image) {
        const visionResponse = await fetch('/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: { type: 'base64', media_type: 'image/jpeg', data: image.split(',')[1] }
                  },
                  {
                    type: 'text',
                    text: 'Analisa esta foto e lista APENAS os vinhos que consegues identificar. Para cada vinho, escreve: nome, tipo (tinto/branco/rosé), região/produtor (se visível) e preço aproximado (se conseguires ver a etiqueta). Se for uma carta, lista os principais vinhos com os preços. Sê conciso e organizado.'
                  }
                ]
              }
            ]
          })
        })

        if (!visionResponse.ok) throw new Error('Erro na análise da imagem')
        const visionData = await visionResponse.json()
        wineList = visionData.content[0]?.text || ''
      }

      // Prompt para Claude
      const prompt = image
        ? `
Prato a servir: ${dish}
Orçamento: €${budgetMin} - €${budgetMax}

Vinhos disponíveis:
${wineList}

Com base no prato e nos vinhos disponíveis, recomenda o melhor vinho para acompanhar. 
Responde no seguinte formato (em português):

RECOMENDAÇÃO: [Nome do vinho]
TIPO: [Tinto/Branco/Rosé]
PREÇO: [Preço aproximado]

RAZÃO DA ESCOLHA: [2-3 frases explicando porque este vinho combina bem com "${dish}". Foca nos sabores, aromas e características]

NOTAS DE DEGUSTAÇÃO: [3-4 características principais do vinho]

SE NÃO HÁ OPÇÃO IDEAL: [Explica alternativas ou porque não há um vinho perfeito]`
        : `
Prato a servir: ${dish}
Orçamento: €${budgetMin} - €${budgetMax}

Com base neste prato e orçamento, recomenda um excelente vinho português ou estrangeiro que combine bem.

Responde no seguinte formato (em português):

RECOMENDAÇÃO: [Nome do vinho e produtor]
TIPO: [Tinto/Branco/Rosé]
PREÇO SUGERIDO: €${budgetMin} - €${budgetMax}

RAZÃO DA ESCOLHA: [2-3 frases explicando porque este vinho combina perfeitamente com "${dish}". Foca nos sabores, aromas e características que realçam o prato]

NOTAS DE DEGUSTAÇÃO: [3-4 características principais do vinho]

REGIÃO/ORIGEM: [Onde encontrar este vinho ou alternativas similares]`

      const recommendResponse = await fetch(
        '/api/claude',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        }
      )

      if (!recommendResponse.ok) throw new Error('Erro ao gerar recomendação')
      const recommendData = await recommendResponse.json()
      const recommendationText = recommendData.content[0]?.text || ''

      // PASSO 4: Guardar no histórico
      console.log('💾 Guardando no histórico...')
      await guardarSugestao(userId, {
        prato: dish,
        budget: { min: budgetMin, max: budgetMax },
        vinhoGarrafeira: matchGarrafeira,
        vinhoIdeal: recommendationText,
        fotoPrato: imagePreview,
        custo: '€0.02'
      })

      setRecommendation(recommendationText)
      setFromCache(false)
    } catch (err) {
      console.error('Erro:', err)
      setError(err.message || 'Erro ao analisar. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="Vinheta" style={{ height: '48px', width: '48px', objectFit: 'contain' }} />
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
            Vinheta
          </h1>
        </div>
        <p style={{ fontFamily: 'Lora, serif', color: 'rgba(253, 230, 138, 0.7)', fontSize: '1rem' }}>
          Descobre o vinho perfeito para a tua refeição
        </p>
      </div>

      {/* Main Card */}
      <div
        className="rounded-2xl p-8 mb-8"
        style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
      >
        {/* Dish Input */}
        <div className="mb-8">
          <label style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37' }} className="block text-xl font-semibold mb-3">
            Que prato vais comer?
          </label>
          <input
            type="text"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            placeholder="Ex: Bacalhau à Brás, Atum grelhado, Coxa de frango..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-600/30 text-white placeholder-amber-100/50 focus:outline-none focus:border-amber-600/70 focus:ring-2 focus:ring-amber-600/20 transition"
            style={{ fontFamily: 'Lora, serif' }}
          />
        </div>

        {/* Budget Range */}
        <div className="mb-8">
          <label style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37' }} className="block text-xl font-semibold mb-4">
            Intervalo de Orçamento
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="text-sm text-amber-100 mb-2">Mínimo</div>
              <div className="flex items-center">
                <span className="text-amber-600 font-semibold mr-2">€</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Math.min(parseInt(e.target.value), budgetMax))}
                  className="w-full"
                />
                <span className="ml-2 text-amber-100 font-semibold">{budgetMin}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-amber-100 mb-2">Máximo</div>
              <div className="flex items-center">
                <span className="text-amber-600 font-semibold mr-2">€</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Math.max(parseInt(e.target.value), budgetMin))}
                  className="w-full"
                />
                <span className="ml-2 text-amber-100 font-semibold">{budgetMax}</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-3 text-amber-200" style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px' }}>
            €{budgetMin} - €{budgetMax}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37' }} className="block text-xl font-semibold mb-3">
            Foto dos Vinhos ou Carta <span className="text-amber-100/70 text-sm font-normal">(Opcional)</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-600/50 hover:border-amber-600 rounded-lg p-8 text-center cursor-pointer transition"
            style={{ background: 'rgba(217, 119, 6, 0.05)' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagePreview ? (
              <div className="space-y-3">
                <img src={imagePreview} alt="Preview" className="h-40 mx-auto rounded-lg object-cover" />
                <p className="text-amber-200 text-sm">Clica para alterar a foto</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload size={32} className="mx-auto text-amber-600" />
                <p className="text-amber-100">Carrega uma foto dos teus vinhos ou de uma carta</p>
                <p className="text-amber-100/60 text-sm">Se não tiveres foto, vamos sugerir um vinho baseado no prato e orçamento</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-600/50 text-red-200">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeWinePairing}
          disabled={loading}
          className="w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: loading ? 'rgba(217, 119, 6, 0.5)' : 'linear-gradient(135deg, #d4af37 0%, #d4af37 100%)',
            color: '#1a0e0e'
          }}
        >
          <Sparkles size={20} />
          {loading ? 'A analisar...' : 'Encontrar Vinho Perfeito'}
        </button>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={24} className="text-amber-600" />
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '28px' }} className="font-bold">
              Recomendação
            </h2>
          </div>

          {/* Cache Badge */}
          {fromCache && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-600/50 text-green-200 text-sm">
              💾 Já sugerido - nenhum custo de API! Reutilizando resultado anterior.
            </div>
          )}
          {!fromCache && (
            <div className="mb-4 p-3 rounded-lg bg-blue-900/30 border border-blue-600/50 text-blue-200 text-sm">
              ✨ Primeira vez - análise IA em tempo real
            </div>
          )}

          <div
            style={{ color: '#f5deb3', fontFamily: 'Lora, serif', lineHeight: '1.8' }}
            className="whitespace-pre-wrap text-base leading-relaxed"
          >
            {typeof recommendation === 'string' ? recommendation : JSON.stringify(recommendation, null, 2)}
          </div>
        </div>
      )}
    </div>
  )
}
