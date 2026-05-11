# 🔐 Guia de Credenciais - VINHETA

Este documento explica exatamente onde e como obter cada credencial necessária.

---

## 📋 Checklist de Credenciais Necessárias

- [ ] Firebase API Key
- [ ] Firebase Auth Domain
- [ ] Firebase Project ID
- [ ] Firebase Storage Bucket
- [ ] Firebase Messaging Sender ID
- [ ] Firebase App ID
- [ ] Anthropic API Key

---

## 🔥 FIREBASE CREDENCIAIS (6 valores)

### Passo 1: Aceder ao Firebase Console

1. Abre https://console.firebase.google.com
2. Login com conta Google
3. Seleciona projeto `vinheta`

### Passo 2: Obter Credenciais

#### Método A: Copiar do Project Settings (Recomendado)

1. **Clica na ⚙️ (Engrenagem)** no canto superior esquerdo
2. **Seleciona "Project Settings"**
3. Vai para aba **"Your apps"**
4. Procura por app web (ou cria uma se não existir)
5. Clica em **"Config"** (ícone de engrenagem)

Vai ver algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "vinheta-xxxxx.firebaseapp.com",
  projectId: "vinheta-xxxxx",
  storageBucket: "vinheta-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678"
};
```

#### Método B: Copiar do Firestore Database

1. Clica em **"Firestore Database"**
2. Clica em **"Start Collection"**
3. A URL da tua database é: `https://console.firebase.google.com/project/{PROJECT_ID}/firestore/...`

---

## 📊 Mapeamento Firebase → .env

Aqui está exatamente o que copiar de onde:

```
firebaseConfig {
  apiKey: "..."                          → VITE_FIREBASE_API_KEY
  authDomain: "..."                      → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "..."                       → VITE_FIREBASE_PROJECT_ID
  storageBucket: "..."                   → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "..."               → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."                           → VITE_FIREBASE_APP_ID
}
```

---

## 🤖 ANTHROPIC API KEY (1 valor)

### Passo 1: Aceder ao Anthropic Console

1. Abre https://console.anthropic.com/
2. Login com conta Google ou email

### Passo 2: Criar/Copiar API Key

1. Clica em **"API keys"** (ou Settings)
2. Clica em **"Create new key"**
3. Dá um nome: `Vinheta`
4. Copia a chave completamente (começa com `sk-ant-`)

⚠️ **Importante**: A chave só aparece UMA VEZ. Guarda bem!

### Passo 3: Adicionar ao .env

```
VITE_ANTHROPIC_API_KEY=sk-ant-v0-abcd1234efgh5678ijklmnop...
```

---

## 📝 Exemplo Completo do .env

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyDaBcD1234efGH5678ijKLmNOpqRsT_uvwxyz
VITE_FIREBASE_AUTH_DOMAIN=vinheta-project123.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-project123
VITE_FIREBASE_STORAGE_BUCKET=vinheta-project123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcd1234efgh5678ijkl

# Anthropic
VITE_ANTHROPIC_API_KEY=sk-ant-v0-aBcD1234efGH5678ijKLmNOpQrStUvwxYz
```

---

## 🔒 Segurança - Regras Importantes

### ✅ Fazer

- ✓ Manter `.env` em `.gitignore`
- ✓ Nunca fazer push do `.env`
- ✓ Usar `.env.example` como template
- ✓ Adicionar variáveis em Netlify via UI
- ✓ Regenerar chaves se vazarem acidentalmente
- ✓ Usar variáveis com prefixo `VITE_` (públicas em frontend)

### ❌ NÃO Fazer

- ✗ Comitar `.env` para Git
- ✗ Compartilhar chaves por email/chat
- ✗ Publicar chaves em issues públicas
- ✗ Usar chaves sem prefixo `VITE_` (não funcionam)
- ✗ Copiapasta de exemplos com valores reais

---

## 🚀 Workflow de Desenvolvimento

### Local (npm run dev)

1. Cria arquivo `.env` na raiz do projeto
2. Preenche com as credenciais do Firebase e Anthropic
3. `npm run dev` lê automaticamente do `.env`

### Netlify (Produção)

1. Netlify nunca vê o `.env` local
2. Vai a **Site settings** > **Build & deploy** > **Environment**
3. Clica em **"Edit variables"**
4. Adiciona cada variável manualmente:
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: `AIzaSy...`
5. Repete para todas as 7 variáveis
6. Deploy automático relê as variáveis

---

## ✅ Checklist de Configuração

### Firebase Console

- [ ] Projeto `vinheta` criado
- [ ] Firestore Database ativado
- [ ] Firebase Storage ativado
- [ ] Google Sign-In ativado em Authentication
- [ ] Web app criada e config copiado
- [ ] Firestore Rules configuradas
- [ ] Storage Rules configuradas

### Anthropic Console

- [ ] Conta Anthropic criada
- [ ] API key gerada
- [ ] Saldo/trial ativo

### Local

- [ ] `.env` criado com 7 variáveis
- [ ] `npm install` executado
- [ ] `npm run dev` funciona

### Netlify

- [ ] Repositório GitHub conectado
- [ ] 7 variáveis adicionadas em Environment
- [ ] Deploy bem-sucedido
- [ ] App funciona em produção

---

## 🆘 Troubleshooting

### "Firebase config error" ao arrancar

**Causa**: Variáveis não preenchidas ou com typo

**Solução**:
```bash
# Verifica o .env
cat .env

# Confirma que está no formato correto:
# VITE_FIREBASE_API_KEY=...
# Sem espaços antes/depois do =
```

### "Anthropic API error: 401"

**Causa**: API key inválida ou expirada

**Solução**:
1. Verifica se a chave começa com `sk-ant-`
2. Regenera uma nova chave em console.anthropic.com
3. Atualiza em .env local
4. Atualiza em Netlify Environment

### App funciona local mas não em Netlify

**Causa**: Variáveis não sincronizadas

**Solução**:
1. Vai a Netlify Dashboard
2. Verifica se as 7 variáveis estão em Environment
3. Clica em "Trigger deploy" para force rebuild
4. Verifica build logs para erros

### "Cannot read properties of undefined"

**Causa**: Firebase não inicializou

**Solução**:
```javascript
// Verifica que firebase.js está correto
import.meta.env.VITE_FIREBASE_API_KEY  // Deve ter valor
```

---

## 📞 Suporte

Se tiver dúvidas:

1. Verifica este documento
2. Abre https://console.firebase.google.com e confirma projeto existe
3. Abre https://console.anthropic.com e confirma API key ativa
4. Abre GitHub Issues

---

**Pronto! Preenche estas 7 variáveis e a app arranca! 🚀**
