import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// ===== ADICIONAR À WISHLIST =====
export async function adicionarAWishlist(userId, dados) {
  try {
    const novoItem = {
      nome: dados.nome,
      tipo: dados.tipo, // tinto, branco, rosé
      regiao: dados.regiao,
      ano: dados.ano || null,
      preco_aproximado: dados.preco || null,
      descricao: dados.descricao || null,
      fonte: dados.fonte || null, // "restaurante", "amigo", "critica", etc
      notas_pessoais: dados.notas || null,
      local_visto: dados.local || null, // Restaurante X, Loja Y
      recomendado_por: dados.recomendadoPor || null,
      criada_em: Timestamp.now(),
      status: 'wishlist' // ou 'comprado'
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/wishlist`),
      novoItem
    )

    return {
      id: docRef.id,
      ...novoItem
    }
  } catch (error) {
    console.error('Erro ao adicionar à wishlist:', error)
    throw error
  }
}

// ===== LISTAR WISHLIST =====
export async function listarWishlist(userId, status = 'wishlist') {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/wishlist`)
    )

    let itens = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter((item) => item.status === status)

    // Ordenar por data (mais recente primeiro)
    itens.sort((a, b) => {
      const timeA = a.criada_em?.toDate?.() || a.criada_em || 0
      const timeB = b.criada_em?.toDate?.() || b.criada_em || 0
      return timeB - timeA
    })

    return itens
  } catch (error) {
    console.error('Erro ao listar wishlist:', error)
    return []
  }
}

// ===== MARCAR COMO COMPRADO =====
export async function marcarComoComprado(userId, itemId, garrafeiraId = null) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/wishlist`, itemId),
      {
        status: 'comprado',
        data_compra: Timestamp.now(),
        garrafeira_id: garrafeiraId || null
      }
    )
  } catch (error) {
    console.error('Erro ao marcar como comprado:', error)
    throw error
  }
}

// ===== REMOVER DA WISHLIST =====
export async function removerDaWishlist(userId, itemId) {
  try {
    await deleteDoc(
      doc(db, `users/${userId}/wishlist`, itemId)
    )
  } catch (error) {
    console.error('Erro ao remover da wishlist:', error)
    throw error
  }
}

// ===== OBTER RECOMENDAÇÕES BASEADAS NA WISHLIST =====
export async function obterRecomendacoes(userId) {
  try {
    const wishlist = await listarWishlist(userId, 'wishlist')

    if (wishlist.length === 0) return []

    // Análise: tipos mais pedidos, regiões, preços
    const analise = {
      tipos_preferidos: {},
      regioes_preferidas: {},
      preco_medio: 0,
      total_items: wishlist.length
    }

    let totalPreco = 0
    let itemsComPreco = 0

    wishlist.forEach((item) => {
      // Tipos
      analise.tipos_preferidos[item.tipo] =
        (analise.tipos_preferidos[item.tipo] || 0) + 1

      // Regiões
      if (item.regiao) {
        analise.regioes_preferidas[item.regiao] =
          (analise.regioes_preferidas[item.regiao] || 0) + 1
      }

      // Preço
      if (item.preco_aproximado) {
        totalPreco += item.preco_aproximado
        itemsComPreco++
      }
    })

    if (itemsComPreco > 0) {
      analise.preco_medio = (totalPreco / itemsComPreco).toFixed(2)
    }

    return analise
  } catch (error) {
    console.error('Erro ao obter recomendações:', error)
    return null
  }
}

// ===== OBTER ESTATÍSTICAS =====
export async function obterEstatisticasWishlist(userId) {
  try {
    const todosList = await getDocs(
      collection(db, `users/${userId}/wishlist`)
    )

    const todos = todosList.docs.map((doc) => doc.data())

    const wishlist = todos.filter((i) => i.status === 'wishlist')
    const comprados = todos.filter((i) => i.status === 'comprado')

    return {
      na_wishlist: wishlist.length,
      comprados: comprados.length,
      total: todos.length,
      taxa_conversao: todos.length > 0
        ? ((comprados.length / todos.length) * 100).toFixed(1)
        : 0,
      gasto_estimado: comprados.reduce(
        (sum, i) => sum + (i.preco_aproximado || 0),
        0
      )
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return null
  }
}
