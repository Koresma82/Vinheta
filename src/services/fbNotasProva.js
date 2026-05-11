import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// ===== REGISTAR NOVA PROVA =====
export async function registarNovaProva(userId, vinhoId, dados) {
  try {
    const novaProva = {
      vinhoId: vinhoId,
      rating: dados.rating, // 1-5 estrelas
      data: Timestamp.fromDate(new Date(dados.data)),
      temperatura: dados.temperatura || null,
      prato_acompanhamento: dados.prato || null,
      acompanhia: dados.acompanhia || null,
      notas_texto: dados.notas || '',
      foto_url: dados.fotoUrl || null,
      sentimentos: dados.sentimentos || [], // ["surpreendido", "feliz", etc]
      criada_em: Timestamp.now()
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/garrafeira/${vinhoId}/provas`),
      novaProva
    )

    // Atualizar rating médio do vinho
    await atualizarRatingVinho(userId, vinhoId)

    return {
      id: docRef.id,
      ...novaProva
    }
  } catch (error) {
    console.error('Erro ao registar prova:', error)
    throw error
  }
}

// ===== ATUALIZAR RATING DO VINHO =====
async function atualizarRatingVinho(userId, vinhoId) {
  try {
    const provasSnap = await getDocs(
      collection(db, `users/${userId}/garrafeira/${vinhoId}/provas`)
    )

    if (provasSnap.empty) return

    const provas = provasSnap.docs.map((doc) => doc.data())
    const ratingMedio = provas.reduce((sum, p) => sum + p.rating, 0) / provas.length

    // Atualizar no vinho
    const { updateDoc: updateDocFunc } = await import('firebase/firestore')
    updateDocFunc(doc(db, `users/${userId}/garrafeira`, vinhoId), {
      rating_medio: parseFloat(ratingMedio.toFixed(1)),
      numero_provas: provas.length
    })
  } catch (error) {
    console.error('Erro ao atualizar rating:', error)
  }
}

// ===== LISTAR PROVAS =====
export async function listarProvas(userId, vinhoId) {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/garrafeira/${vinhoId}/provas`)
    )

    let provas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    // Ordenar por data (mais recente primeiro)
    provas.sort((a, b) => {
      const timeA = a.data?.toDate?.() || a.data || 0
      const timeB = b.data?.toDate?.() || b.data || 0
      return timeB - timeA
    })

    return provas
  } catch (error) {
    console.error('Erro ao listar provas:', error)
    return []
  }
}

// ===== OBTER ÚLTIMA PROVA =====
export async function obterUltimaProva(userId, vinhoId) {
  try {
    const provas = await listarProvas(userId, vinhoId)
    return provas.length > 0 ? provas[0] : null
  } catch (error) {
    console.error('Erro ao obter última prova:', error)
    return null
  }
}

// ===== REMOVER PROVA =====
export async function removerProva(userId, vinhoId, provaId) {
  try {
    await deleteDoc(
      doc(db, `users/${userId}/garrafeira/${vinhoId}/provas`, provaId)
    )

    // Atualizar rating do vinho
    await atualizarRatingVinho(userId, vinhoId)
  } catch (error) {
    console.error('Erro ao remover prova:', error)
    throw error
  }
}

// ===== ESTATÍSTICAS DE PROVAS =====
export async function obterEstatisticasProvas(userId, vinhoId) {
  try {
    const provas = await listarProvas(userId, vinhoId)

    if (provas.length === 0) {
      return {
        total: 0,
        rating_medio: 0,
        temperatura_ideal: null,
        prato_ideal: null
      }
    }

    // Encontrar prato mais comum
    const pratos = provas
      .filter((p) => p.prato_acompanhamento)
      .map((p) => p.prato_acompanhamento)

    const pratoContagem = {}
    pratos.forEach((p) => {
      pratoContagem[p] = (pratoContagem[p] || 0) + 1
    })

    const pratoIdeal = pratos.length > 0
      ? Object.keys(pratoContagem).reduce((a, b) =>
          pratoContagem[a] > pratoContagem[b] ? a : b
        )
      : null

    // Encontrar temperatura mais comum
    const temperaturas = provas
      .filter((p) => p.temperatura)
      .map((p) => p.temperatura)

    const tempMedia = temperaturas.length > 0
      ? (temperaturas.reduce((a, b) => a + b) / temperaturas.length).toFixed(1)
      : null

    return {
      total: provas.length,
      rating_medio: (provas.reduce((sum, p) => sum + p.rating, 0) / provas.length).toFixed(1),
      temperatura_ideal: tempMedia,
      prato_ideal: pratoIdeal,
      provas_por_mes: calcularProvasPorMes(provas),
      sentimentos_comuns: obterSentimentosComuns(provas)
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return null
  }
}

// ===== HELPER: Provas por mês =====
function calcularProvasPorMes(provas) {
  const meses = {}

  provas.forEach((p) => {
    const data = p.data?.toDate?.() || p.data
    if (data) {
      const mes = data.toLocaleDateString('pt-PT', { year: 'numeric', month: 'short' })
      meses[mes] = (meses[mes] || 0) + 1
    }
  })

  return meses
}

// ===== HELPER: Sentimentos comuns =====
function obterSentimentosComuns(provas) {
  const sentimentos = {}

  provas.forEach((p) => {
    if (p.sentimentos && Array.isArray(p.sentimentos)) {
      p.sentimentos.forEach((s) => {
        sentimentos[s] = (sentimentos[s] || 0) + 1
      })
    }
  })

  return Object.entries(sentimentos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sentimento, count]) => ({ sentimento, count }))
}

// ===== OBTER ESTATÍSTICAS GLOBAIS (TODOS OS VINHOS) =====
export async function obterEstatisticasGlobaisProvas(userId) {
  try {
    const { listarGarrafeira } = await import('./fbGarrafeira.js')
    const garrafeira = await listarGarrafeira(userId)

    let totalProvas = 0
    let totalRating = 0
    let provasComRating = 0

    for (const vinho of garrafeira) {
      const provas = await listarProvas(userId, vinho.id)
      totalProvas += provas.length
      provas.forEach((p) => {
        totalRating += p.rating
        provasComRating++
      })
    }

    return {
      total_provas: totalProvas,
      rating_medio_global: provasComRating > 0
        ? (totalRating / provasComRating).toFixed(1)
        : 0,
      vinhos_provados: garrafeira.filter((v) => (v.numero_provas || 0) > 0).length
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas globais:', error)
    return null
  }
}
