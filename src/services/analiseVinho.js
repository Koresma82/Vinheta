// ===== ANÁLISE VISUAL DE SABOR - RADAR =====
export function criarPerfilSabor(vinho) {
  // Retorna perfil para radar gráfico (0-100)
  return {
    acidez: calcularAcidez(vinho),
    corpo: calcularCorpo(vinho),
    taninos: calcularTaninos(vinho),
    fruta: calcularFruta(vinho),
    aroma: calcularAroma(vinho),
    doçura: calcularDoçura(vinho)
  }
}

function calcularAcidez(vinho) {
  // Branco tem mais acidez, tinto menos
  // Jovem tem mais, envelhecido menos
  const tipoScore = vinho.tipo === 'branco' ? 70 : 40
  const idadeScore = vinho.ano ? (new Date().getFullYear() - vinho.ano) * 5 : 0
  return Math.max(20, Math.min(100, tipoScore - idadeScore))
}

function calcularCorpo(vinho) {
  // Tinto tem mais corpo, branco menos
  // Castas influem (Cabernet = corpo alto)
  const tipoScore = vinho.tipo === 'tinto' ? 75 : 45
  const castaScore = vinho.castas?.some((c) =>
    ['Cabernet', 'Touriga'].includes(c)
  )
    ? 20
    : vinho.castas?.some((c) => ['Merlot', 'Pinot'].includes(c))
      ? 10
      : 0
  return Math.min(100, tipoScore + castaScore)
}

function calcularTaninos(vinho) {
  // Apenas tinto tem taninos significativos
  if (vinho.tipo !== 'tinto') return 15

  // Touriga, Cabernet = taninos altos
  const castaScore = vinho.castas?.some((c) =>
    ['Touriga', 'Cabernet', 'Nebbiolo'].includes(c)
  )
    ? 80
    : vinho.castas?.some((c) => ['Merlot', 'Pinot'].includes(c))
      ? 50
      : 40

  // Envelhecimento reduz taninos
  const idadeScore = vinho.ano ? Math.min(30, (new Date().getFullYear() - vinho.ano) * 3) : 0
  return Math.max(10, castaScore - idadeScore)
}

function calcularFruta(vinho) {
  // Vinho jovem tem mais fruta
  // Branco tropical (90), tinto vermelha (75)
  const tipoScore = vinho.tipo === 'branco' ? 85 : 75
  const idadeScore = vinho.ano ? (new Date().getFullYear() - vinho.ano) * 4 : 0
  return Math.max(20, tipoScore - idadeScore)
}

function calcularAroma(vinho) {
  // Branco tem aromas florais, tinto especiados
  // Jovem tem aroma intenso, velho mais sutil
  const tipoScore = 70
  const idadeScore = vinho.ano ? (new Date().getFullYear() - vinho.ano) * 2 : 0
  return Math.max(20, tipoScore - idadeScore)
}

function calcularDoçura(vinho) {
  // Maioria dos vinhos secos (baixa doçura)
  // Branco pode ter mais açúcar residual
  const tipoScore = vinho.tipo === 'branco' ? 30 : 15
  const baseScore = 10
  return Math.min(60, baseScore + tipoScore)
}

// ===== COMPATIBILIDADE ENTRE VINHOS =====
export function calcularCompatibilidade(vinho1, vinho2) {
  const perfil1 = criarPerfilSabor(vinho1)
  const perfil2 = criarPerfilSabor(vinho2)

  // Calcular diferença
  let diferenca = 0
  Object.keys(perfil1).forEach((chave) => {
    diferenca += Math.abs(perfil1[chave] - perfil2[chave])
  })

  // Normalizar para 0-100
  const media = diferenca / Object.keys(perfil1).length
  const compatibilidade = Math.max(0, 100 - media)

  return Math.round(compatibilidade)
}

// ===== PREVISÕES DE BEBIDA =====
export function obterPrevisaoBebida(vinho) {
  if (!vinho.ano) {
    return {
      status: 'desconhecido',
      mensagem: 'Ano não registado'
    }
  }

  const agora = new Date().getFullYear()
  const idade = agora - vinho.ano
  const estilo = vinho.tipo

  // Estimativas baseadas no tipo
  let ideal_minimo = 1
  let ideal_maximo = 5
  let atual_status = 'juventude'

  if (estilo === 'tinto') {
    // Tinto: 3-15 anos
    ideal_minimo = 3
    ideal_maximo = 15
    if (idade < 2) atual_status = 'jovem-beberTodaviaRígido'
    else if (idade >= 3 && idade <= 10) atual_status = 'pico'
    else if (idade > 10 && idade <= 15) atual_status = 'envelhecido-premium'
    else if (idade > 15) atual_status = 'muito-velho-risco'
  } else if (estilo === 'branco') {
    // Branco: 1-3 anos (maioria)
    ideal_minimo = 1
    ideal_maximo = 3
    if (idade < 1) atual_status = 'muito-jovem'
    else if (idade >= 1 && idade <= 2) atual_status = 'perfeito'
    else if (idade > 2 && idade <= 5) atual_status = 'declinio-gradual'
    else if (idade > 5) atual_status = 'beber-urgente'
  } else if (estilo === 'rosé') {
    // Rosé: 1-2 anos
    ideal_minimo = 1
    ideal_maximo = 2
    if (idade < 1) atual_status = 'muito-jovem'
    else if (idade >= 1 && idade <= 2) atual_status = 'ideal'
    else if (idade > 2) atual_status = 'beber-urgente'
  }

  const urgencia = idade > ideal_maximo ? 'urgente' : 'normal'

  return {
    status: atual_status,
    idade_atual: idade,
    ideal_minimo: ideal_minimo,
    ideal_maximo: ideal_maximo,
    urgencia: urgencia,
    mensagem: gerarMensagemBebida(atual_status, vinho),
    recomendacao: gerarRecomendacao(atual_status, idade, ideal_maximo)
  }
}

function gerarMensagemBebida(status, vinho) {
  const mensagens = {
    'jovem-beberTodaviaRígido': `${vinho.nome} ainda está muito jovem. Recomendamos guardar mais 1-2 anos.`,
    pico: `${vinho.nome} está no seu PICO! Perfeito para beber AGORA.`,
    'envelhecido-premium': `${vinho.nome} está excelentemente envelhecido. Bebe com confiança!`,
    'muito-velho-risco': `⚠️ ${vinho.nome} pode estar em declínio. Beber em breve!`,
    'muito-jovem': `${vinho.nome} está muito jovem. Deixa respirar 6-12 meses.`,
    perfeito: `${vinho.nome} está PERFEITO AGORA! Melhor altura para beber.`,
    'declinio-gradual': `${vinho.nome} está em ligeiro declínio. Bebe nos próximos meses.`,
    'beber-urgente': `🔴 BEBER URGENTE! ${vinho.nome} não vai melhorar.`,
    ideal: `${vinho.nome} está ideal para beber AGORA!`,
    desconhecido: 'Ano não registado'
  }
  return mensagens[status] || 'Status desconhecido'
}

function gerarRecomendacao(status, idade, maximo) {
  const urgenciaEmanos = Math.max(0, maximo - idade)

  if (status === 'pico' || status === 'perfeito' || status === 'ideal') {
    return 'Bebe AGORA! Está no melhor momento.'
  } else if (
    status === 'muito-velho-risco' ||
    status === 'beber-urgente'
  ) {
    return 'Bebe nos próximos 1-3 meses. Não esperes mais!'
  } else if (status === 'declinio-gradual') {
    return `Bebe nos próximos ${urgenciaEmanos} meses para máxima qualidade.`
  } else if (
    status === 'jovem-beberTodaviaRígido' ||
    status === 'muito-jovem'
  ) {
    return `Guarda por 1-2 anos. Ainda vai melhorar significativamente.`
  } else if (status === 'envelhecido-premium') {
    return 'Bebe com total confiança. Está excelente!'
  }

  return 'Consultar recomendações específicas.'
}

// ===== ALERTAS DE BEBIDA =====
export function gerarAlertas(garrafeira) {
  const alertas = {
    beber_urgente: [],
    no_pico: [],
    guardar_ainda: [],
    em_risco: []
  }

  garrafeira.forEach((vinho) => {
    const previsao = obterPrevisaoBebida(vinho)

    if (previsao.urgencia === 'urgente') {
      alertas.beber_urgente.push({
        vinho: vinho.nome,
        mensagem: previsao.mensagem
      })
    }

    if (
      previsao.status === 'pico' ||
      previsao.status === 'perfeito'
    ) {
      alertas.no_pico.push({
        vinho: vinho.nome,
        mensagem: 'Está no pico! Bebe agora.'
      })
    }

    if (
      previsao.status === 'jovem-beberTodaviaRígido' ||
      previsao.status === 'muito-jovem'
    ) {
      alertas.guardar_ainda.push({
        vinho: vinho.nome,
        anos: previsao.ideal_minimo - previsao.idade_atual
      })
    }

    if (previsao.status === 'muito-velho-risco') {
      alertas.em_risco.push({
        vinho: vinho.nome,
        mensagem: 'Pode estar em risco. Verificar antes!'
      })
    }
  })

  return alertas
}

// ===== SUGESTÕES BASEADAS NA ANÁLISE =====
export function sugerirVinhoBaseadoEmPaladar(garrafeira, preferencias) {
  // preferencias = {
  //   acidez: 60,
  //   corpo: 70,
  //   taninos: 50,
  //   fruta: 80,
  //   aroma: 70,
  //   doçura: 20
  // }

  const scores = garrafeira.map((vinho) => {
    const perfil = criarPerfilSabor(vinho)
    let score = 0

    Object.keys(preferencias).forEach((chave) => {
      const diff = Math.abs(perfil[chave] - preferencias[chave])
      score += 100 - diff
    })

    return {
      vinho,
      score: (score / Object.keys(preferencias).length).toFixed(1)
    }
  })

  // Ordenar por score
  scores.sort((a, b) => b.score - a.score)

  return scores.slice(0, 5) // Top 5
}
