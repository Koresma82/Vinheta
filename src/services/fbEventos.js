import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// ===== CRIAR EVENTO =====
export async function criarEvento(userId, dados) {
  try {
    const novoEvento = {
      nome: dados.nome,
      data: Timestamp.fromDate(new Date(dados.data)),
      local: dados.local || null,
      numero_pessoas: dados.numeroPessoas || 1,
      tipo: dados.tipo || 'jantar', // jantar, almoço, coquetel, etc
      pratos: dados.pratos || [], // [{descricao, tipo, momento}]
      vinhos_sugeridos: dados.vinhosSugeridos || [], // [garrafaId]
      vinhos_ideais: dados.vinhosIdeais || [],
      descricao: dados.descricao || null,
      convidados: dados.convidados || [], // [{nome, email}]
      status: 'planejado', // planejado, realizado, cancelado
      criada_em: Timestamp.now(),
      atualizada_em: Timestamp.now()
    }

    const docRef = await addDoc(
      collection(db, `users/${userId}/eventos`),
      novoEvento
    )

    return {
      id: docRef.id,
      ...novoEvento
    }
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    throw error
  }
}

// ===== LISTAR EVENTOS =====
export async function listarEventos(userId, filtro = 'proximos') {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/eventos`)
    )

    let eventos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    const agora = new Date()

    // Filtros
    if (filtro === 'proximos') {
      eventos = eventos.filter((e) => {
        const data = e.data?.toDate?.() || e.data
        return data >= agora && e.status === 'planejado'
      })
    } else if (filtro === 'passados') {
      eventos = eventos.filter((e) => {
        const data = e.data?.toDate?.() || e.data
        return data < agora
      })
    } else if (filtro === 'realizados') {
      eventos = eventos.filter((e) => e.status === 'realizado')
    }

    // Ordenar por data
    eventos.sort((a, b) => {
      const timeA = a.data?.toDate?.() || a.data || 0
      const timeB = b.data?.toDate?.() || b.data || 0
      return timeA - timeB
    })

    return eventos
  } catch (error) {
    console.error('Erro ao listar eventos:', error)
    return []
  }
}

// ===== OBTER EVENTO =====
export async function obterEvento(userId, eventoId) {
  try {
    const docSnap = await getDocs(
      collection(db, `users/${userId}/eventos`)
    ).then((snap) =>
      snap.docs.find((doc) => doc.id === eventoId)
    )

    if (!docSnap) return null

    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    console.error('Erro ao obter evento:', error)
    return null
  }
}

// ===== ATUALIZAR EVENTO =====
export async function atualizarEvento(userId, eventoId, dados) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/eventos`, eventoId),
      {
        ...dados,
        atualizada_em: Timestamp.now()
      }
    )
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    throw error
  }
}

// ===== MARCAR COMO REALIZADO =====
export async function marcarComoRealizado(userId, eventoId, feedback = null) {
  try {
    await updateDoc(
      doc(db, `users/${userId}/eventos`, eventoId),
      {
        status: 'realizado',
        data_realizacao: Timestamp.now(),
        feedback: feedback || null,
        atualizada_em: Timestamp.now()
      }
    )
  } catch (error) {
    console.error('Erro ao marcar como realizado:', error)
    throw error
  }
}

// ===== REMOVER EVENTO =====
export async function removerEvento(userId, eventoId) {
  try {
    await deleteDoc(
      doc(db, `users/${userId}/eventos`, eventoId)
    )
  } catch (error) {
    console.error('Erro ao remover evento:', error)
    throw error
  }
}

// ===== SUGERIR VINHOS PARA EVENTO =====
export async function sugerirVinhosParaEvento(userId, eventoId, garrafeira) {
  try {
    const evento = await obterEvento(userId, eventoId)
    if (!evento) throw new Error('Evento não encontrado')

    const sugestoes = {
      entrada: null,
      principal: null,
      sobremesa: null,
      alternativas: []
    }

    // Procurar por momento
    evento.pratos.forEach((prato) => {
      let vinhoIdeal = null

      // Lógica simples: tipo de prato → tipo de vinho
      if (prato.tipo === 'entrada') {
        // Prefere branco ou rosé
        vinhoIdeal = garrafeira.find(
          (v) => (v.tipo === 'branco' || v.tipo === 'rosé') && v.quantidade > 0
        )
      } else if (prato.tipo === 'principal') {
        // Depende do tipo de comida
        if (prato.descricao.toLowerCase().includes('peixe')) {
          vinhoIdeal = garrafeira.find((v) => v.tipo === 'branco' && v.quantidade > 0)
        } else if (prato.descricao.toLowerCase().includes('carne')) {
          vinhoIdeal = garrafeira.find((v) => v.tipo === 'tinto' && v.quantidade > 0)
        }
      } else if (prato.tipo === 'sobremesa') {
        // Vinho do Porto, Moscatel, etc
        vinhoIdeal = garrafeira.find((v) => v.tipo === 'rosé' && v.quantidade > 0)
      }

      if (vinhoIdeal) {
        sugestoes[prato.tipo] = {
          vinhoId: vinhoIdeal.id,
          nome: vinhoIdeal.nome,
          quantidade_necessaria: 1
        }
      }
    })

    // Alternativas
    sugestoes.alternativas = garrafeira
      .filter(
        (v) =>
          !Object.values(sugestoes).some((s) => s?.vinhoId === v.id) &&
          v.quantidade > 0
      )
      .slice(0, 3)
      .map((v) => ({
        id: v.id,
        nome: v.nome,
        tipo: v.tipo
      }))

    return sugestoes
  } catch (error) {
    console.error('Erro ao sugerir vinhos:', error)
    return null
  }
}

// ===== CALCULAR CUSTO DO EVENTO =====
export async function calcularCustoEvento(userId, eventoId, garrafeira) {
  try {
    const evento = await obterEvento(userId, eventoId)
    if (!evento) throw new Error('Evento não encontrado')

    let custoTotal = 0

    evento.vinhos_sugeridos.forEach((vinhoId) => {
      const vinho = garrafeira.find((v) => v.id === vinhoId)
      if (vinho) {
        custoTotal += vinho.preco_aproximado || 0
      }
    })

    return {
      custo_total: custoTotal,
      custo_per_capita: (custoTotal / evento.numero_pessoas).toFixed(2),
      numero_garrafas: evento.vinhos_sugeridos.length
    }
  } catch (error) {
    console.error('Erro ao calcular custo:', error)
    return null
  }
}

// ===== OBTER ESTATÍSTICAS =====
export async function obterEstatisticasEventos(userId) {
  try {
    const eventos = await listarEventos(userId, 'todos')

    const agora = new Date()
    const proximos = eventos.filter((e) => {
      const data = e.data?.toDate?.() || e.data
      return data >= agora && e.status === 'planejado'
    })

    const realizados = eventos.filter((e) => e.status === 'realizado')

    return {
      total: eventos.length,
      proximos: proximos.length,
      realizados: realizados.length,
      proximo_evento: proximos.length > 0 ? proximos[0] : null,
      pessoas_convidadas_total: realizados.reduce(
        (sum, e) => sum + (e.numero_pessoas || 0),
        0
      )
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    return null
  }
}
