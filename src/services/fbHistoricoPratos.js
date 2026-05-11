import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// ===== NORMALIZAÇÃO =====
export function normalizarPrato(prato) {
  return prato
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}

// ===== BUSCAR NO HISTÓRICO (CACHE) =====
export async function procurarPratoHistorico(userId, prato, budget) {
  try {
    const pratoNorm = normalizarPrato(prato)

    const q = query(
      collection(db, `users/${userId}/historico_pratos`),
      where('prato_normalizado', '==', pratoNorm)
    )

    const resultado = await getDocs(q)

    if (resultado.empty) {
      return null // Não encontrou
    }

    const pratoExistente = resultado.docs[0].data()
    const pratoId = resultado.docs[0].id

    // Valida budget
    const budgetCompativel =
      budget.min >= pratoExistente.budget_min &&
      budget.max <= pratoExistente.budget_max

    if (budgetCompativel) {
      // CACHE HIT! Incrementa contador
      await atualizarPratoHistorico(userId, pratoId, {
        vezes_sugerido: (pratoExistente.vezes_sugerido || 0) + 1,
        ultima_sugestao: Timestamp.now()
      })

      return {
        ...pratoExistente,
        pratoId,
        foi_cache: true,
        economia: true
      }
    }

    return null
  } catch (error) {
    console.error('Erro ao procurar prato:', error)
    return null
  }
}

// ===== GUARDAR NOVA SUGESTÃO =====
export async function guardarSugestao(userId, dados) {
  try {
    const pratoNorm = normalizarPrato(dados.prato)

    const novaRecomendacao = {
      prato: dados.prato,
      prato_normalizado: pratoNorm,
      budget_min: dados.budget.min,
      budget_max: dados.budget.max,
      vinho_garrafeira: dados.vinhoGarrafeira || null,
      vinho_ideal: dados.vinhoIdeal || null,
      foto_prato_url: dados.fotoPrato || null,
      vezes_sugerido: 1,
      primeira_sugestao: Timestamp.now(),
      ultima_sugestao: Timestamp.now(),
      api_custo: dados.custo || '€0.02',
      foi_cache_hit: false,
      utilizador_escolheu: dados.escolhido || null,
      criada_em: Timestamp.now()
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/historico_pratos`),
      novaRecomendacao
    )

    // Atualiza estatísticas
    await atualizarEstatisticas(userId, false)

    return docRef.id
  } catch (error) {
    console.error('Erro ao guardar sugestão:', error)
    throw error
  }
}

// ===== ATUALIZAR PRATO EXISTENTE =====
export async function atualizarPratoHistorico(userId, pratoId, dados) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/historico_pratos`, pratoId),
      dados
    )
  } catch (error) {
    console.error('Erro ao atualizar prato:', error)
    throw error
  }
}

// ===== ATUALIZAR ESTATÍSTICAS =====
export async function atualizarEstatisticas(userId, foiCache) {
  try {
    const statsRef = doc(db, `users/${userId}/estatisticas_api`, 'geral')

    // Obter stats atuais
    const statsSnap = await getDocs(
      collection(db, `users/${userId}/estatisticas_api`)
    )

    const stats = statsSnap.docs[0]?.data() || {
      chamadas_totais: 0,
      cache_hits: 0,
      chamadas_reais: 0,
      custo_estimado: 0
    }

    const chamadosTotais = (stats.chamadas_totais || 0) + 1
    const cacheHits = (stats.cache_hits || 0) + (foiCache ? 1 : 0)
    const chamadosReais = (stats.chamadas_reais || 0) + (foiCache ? 0 : 1)

    const novasStats = {
      chamadas_totais: chamadosTotais,
      cache_hits: cacheHits,
      chamadas_reais: chamadosReais,
      custo_estimado: chamadosReais * 0.02,
      custo_poupado: cacheHits * 0.02,
      economia_percentual: Math.round((cacheHits / chamadosTotais) * 100),
      ultima_atualizacao: Timestamp.now()
    }

    await setDoc(statsRef, novasStats)

    return novasStats
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error)
  }
}

// ===== LISTAR HISTÓRICO =====
export async function listarHistoricoPratos(userId, filtro = 'todos') {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/historico_pratos`)
    )

    let pratos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    // Ordenar por última sugestão (mais recente primeiro)
    pratos.sort((a, b) => {
      const timeA = a.ultima_sugestao?.toDate?.() || a.ultima_sugestao || 0
      const timeB = b.ultima_sugestao?.toDate?.() || b.ultima_sugestao || 0
      return timeB - timeA
    })

    // Aplicar filtros
    if (filtro === 'favoritos') {
      pratos = pratos.filter((p) => p.vezes_sugerido >= 3)
    } else if (filtro === 'recentes') {
      const umaSemana = Date.now() - 7 * 24 * 60 * 60 * 1000
      pratos = pratos.filter((p) => {
        const time = p.ultima_sugestao?.toDate?.() || p.ultima_sugestao || 0
        return time > umaSemana
      })
    }

    return pratos
  } catch (error) {
    console.error('Erro ao listar histórico:', error)
    return []
  }
}

// ===== REMOVER PRATO =====
export async function removerPratoHistorico(userId, pratoId) {
  try {
    await deleteDoc(
      doc(db, `users/${userId}/historico_pratos`, pratoId)
    )
  } catch (error) {
    console.error('Erro ao remover prato:', error)
    throw error
  }
}

// ===== OBTER ESTATÍSTICAS =====
export async function obterEstatisticas(userId) {
  try {
    const statsSnap = await getDocs(
      collection(db, `users/${userId}/estatisticas_api`)
    )

    return statsSnap.docs[0]?.data() || {
      chamadas_totais: 0,
      cache_hits: 0,
      chamadas_reais: 0,
      custo_estimado: 0,
      custo_poupado: 0,
      economia_percentual: 0
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return null
  }
}
