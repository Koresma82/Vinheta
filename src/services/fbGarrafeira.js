import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

// ===== ADICIONAR VINHO =====
export async function adicionarVinho(userId, dados) {
  try {
    let imagemUrl = null

    // Upload da imagem se existir
    if (dados.imagemBase64) {
      imagemUrl = await uploadImagemGarrafeira(userId, dados.imagemBase64)
    }

    const novoVinho = {
      nome: dados.nome,
      tipo: dados.tipo, // tinto, branco, rosé
      regiao: dados.regiao,
      ano: dados.ano,
      castas: dados.castas || [], // array
      descricao: dados.descricao,
      preco_aproximado: dados.preco || 0,
      alcool: dados.alcool || null,
      temperatura_ideal: dados.temperatura || null,
      quantidade: dados.quantidade || 1,
      imagem_url: imagemUrl,
      criada_em: Timestamp.now(),
      ultima_atualizacao: Timestamp.now(),
      rating_medio: 0,
      numero_provas: 0,
      notas_pessoais: dados.notas || null
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/garrafeira`),
      novoVinho
    )

    return {
      id: docRef.id,
      ...novoVinho
    }
  } catch (error) {
    console.error('Erro ao adicionar vinho:', error)
    throw error
  }
}

// ===== UPLOAD IMAGEM =====
async function uploadImagemGarrafeira(userId, imagemBase64) {
  try {
    const timestamp = Date.now()
    const fileName = `${userId}_${timestamp}.jpg`
    const storageRef = ref(storage, `garrafeira/${userId}/${fileName}`)

    // Converter base64 para blob
    const byteCharacters = atob(imagemBase64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/jpeg' })

    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)

    return url
  } catch (error) {
    console.error('Erro ao upload imagem:', error)
    return null
  }
}

// ===== LISTAR GARRAFEIRA =====
export async function listarGarrafeira(userId, filtro = 'todos') {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/garrafeira`)
    )

    let vinhos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filtros
    if (filtro === 'tinto') {
      vinhos = vinhos.filter((v) => v.tipo === 'tinto')
    } else if (filtro === 'branco') {
      vinhos = vinhos.filter((v) => v.tipo === 'branco')
    } else if (filtro === 'rosé') {
      vinhos = vinhos.filter((v) => v.tipo === 'rosé')
    }

    // Ordenar por data (mais recente primeiro)
    vinhos.sort((a, b) => {
      const timeA = a.criada_em?.toDate?.() || a.criada_em || 0
      const timeB = b.criada_em?.toDate?.() || b.criada_em || 0
      return timeB - timeA
    })

    return vinhos
  } catch (error) {
    console.error('Erro ao listar garrafeira:', error)
    return []
  }
}

// ===== OBTER VINHO =====
export async function obterVinho(userId, vinhoId) {
  try {
    const docSnap = await getDocs(
      query(
        collection(db, `users/${userId}/garrafeira`),
        where('__name__', '==', vinhoId)
      )
    )

    if (docSnap.empty) return null

    return {
      id: docSnap.docs[0].id,
      ...docSnap.docs[0].data()
    }
  } catch (error) {
    console.error('Erro ao obter vinho:', error)
    return null
  }
}

// ===== ATUALIZAR VINHO =====
export async function atualizarVinho(userId, vinhoId, dados) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/garrafeira`, vinhoId),
      {
        ...dados,
        ultima_atualizacao: Timestamp.now()
      }
    )
  } catch (error) {
    console.error('Erro ao atualizar vinho:', error)
    throw error
  }
}

// ===== ATUALIZAR QUANTIDADE =====
export async function atualizarQuantidade(userId, vinhoId, novaQtd) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/garrafeira`, vinhoId),
      {
        quantidade: novaQtd,
        ultima_atualizacao: Timestamp.now()
      }
    )
  } catch (error) {
    console.error('Erro ao atualizar quantidade:', error)
    throw error
  }
}

// ===== REMOVER VINHO =====
export async function removerVinho(userId, vinhoId) {
  try {
    const vinho = await obterVinho(userId, vinhoId)

    // Remover imagem se existir
    if (vinho?.imagem_url) {
      try {
        const storageRef = ref(storage, vinho.imagem_url)
        await deleteObject(storageRef)
      } catch (e) {
        console.warn('Aviso ao remover imagem:', e)
      }
    }

    await deleteDoc(
      doc(db, `users/${userId}/garrafeira`, vinhoId)
    )
  } catch (error) {
    console.error('Erro ao remover vinho:', error)
    throw error
  }
}

// ===== PROCURAR MATCH NA GARRAFEIRA =====
export async function procurarMatchGarrafeira(userId, tipoVinhoIdeal) {
  try {
    const garrafeira = await listarGarrafeira(userId)

    // Procura por tipo similar
    const matches = garrafeira.filter(
      (v) => v.tipo === tipoVinhoIdeal && v.quantidade > 0
    )

    if (matches.length === 0) return null

    // Retorna o com melhor rating
    matches.sort((a, b) => b.rating_medio - a.rating_medio)

    return matches[0]
  } catch (error) {
    console.error('Erro ao procurar match:', error)
    return null
  }
}

// ===== OBTER ESTATÍSTICAS GARRAFEIRA =====
export async function obterEstatisticasGarrafeira(userId) {
  try {
    const garrafeira = await listarGarrafeira(userId)

    const stats = {
      total: garrafeira.length,
      quantidade_total: garrafeira.reduce((sum, v) => sum + (v.quantidade || 0), 0),
      valor_total: garrafeira.reduce((sum, v) => sum + ((v.preco_aproximado || 0) * (v.quantidade || 1)), 0),
      rating_medio: garrafeira.length > 0
        ? (garrafeira.reduce((sum, v) => sum + (v.rating_medio || 0), 0) / garrafeira.length).toFixed(1)
        : 0,
      por_tipo: {
        tinto: garrafeira.filter((v) => v.tipo === 'tinto').length,
        branco: garrafeira.filter((v) => v.tipo === 'branco').length,
        rosé: garrafeira.filter((v) => v.tipo === 'rosé').length
      },
      regioes: [...new Set(garrafeira.map((v) => v.regiao))].length,
      castas_unicas: [...new Set(garrafeira.flatMap((v) => v.castas || []))].length
    }

    return stats
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return null
  }
}
