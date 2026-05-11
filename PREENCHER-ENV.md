# 📝 Como Preencher o .env - Guia Visual

## 🎯 Objetivo

Preencher este arquivo `.env` com 7 credenciais do Firebase e Anthropic:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ANTHROPIC_API_KEY=
```

---

## 1️⃣ OBTER CREDENCIAIS DO FIREBASE

### Passo A: Abrir Firebase Console

```
https://console.firebase.google.com
```

Vai parecer assim:

```
┌─────────────────────────────────────────┐
│  Firebase Console                       │
│  ┌──────────────────────────────────┐   │
│  │ Vinheta (Projeto)                │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Passo B: Clicar em Project Settings

```
Canto superior esquerdo → ⚙️ (Engrenagem) → Project Settings
```

Vais ver:

```
┌─────────────────────────────────────┐
│ Project Settings                    │
│                                     │
│ Tabs: General | Service Acc... │... │
├─────────────────────────────────────┤
│ Your apps                           │
│ ┌─────────────────────────────────┐ │
│ │ Web app icon                    │ │
│ │ vinheta                         │ │
│ │ [Config Button]                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Passo C: Clicar em [Config]

Vai aparecer a configuração:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDaBcD...",
  authDomain: "vinheta-xxxxx.firebaseapp.com",
  projectId: "vinheta-xxxxx",
  storageBucket: "vinheta-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh"
};
```

### Passo D: Copiar para .env

Abre o ficheiro `.env` no teu editor e preenche:

```env
# Copia:  apiKey
VITE_FIREBASE_API_KEY=AIzaSyDaBcD...

# Copia: authDomain
VITE_FIREBASE_AUTH_DOMAIN=vinheta-xxxxx.firebaseapp.com

# Copia: projectId
VITE_FIREBASE_PROJECT_ID=vinheta-xxxxx

# Copia: storageBucket
VITE_FIREBASE_STORAGE_BUCKET=vinheta-xxxxx.appspot.com

# Copia: messagingSenderId
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012

# Copia: appId
VITE_FIREBASE_APP_ID=1:123456789012:web:abcd1234efgh
```

---

## 2️⃣ OBTER API KEY DO ANTHROPIC

### Passo A: Abrir Anthropic Console

```
https://console.anthropic.com
```

### Passo B: Ir a API Keys

```
Canto esquerdo → API keys
```

Vai parecer assim:

```
┌──────────────────────────────────┐
│ API Keys                         │
│                                  │
│ [Create Key] [Revoke]           │
│                                  │
│ ┌────────────────────────────┐   │
│ │ vinheta                    │   │
│ │ sk-ant-v0-abcd1234...     │   │
│ │ Created: 2026-05-06        │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

### Passo C: Copiar a chave

Clica no ícone de copy ao lado da chave.

A chave completa é: `sk-ant-v0-abcd1234efgh5678...`

### Passo D: Preencher no .env

```env
VITE_ANTHROPIC_API_KEY=sk-ant-v0-abcd1234efgh5678...
```

---

## ✅ Ficheiro .env Completo

Quando estiver tudo preenchido, o teu `.env` vai parecer assim:

```env
# Firebase Configuration
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

## 🧪 Testar o .env

Depois de preencher, testa:

```bash
# Terminal
npm run dev
```

Se vir `http://localhost:3000` a carregar, está correto! ✅

Se vir erro de config, verifica:
- Nenhum espaço antes/depois do `=`
- Sem aspas
- Sem caracteres especiais acidentais

---

## 📱 Adicionar a Netlify

Depois de fazer push para GitHub e conectar a Netlify:

1. **Vai a Netlify Dashboard**
2. **Site settings → Build & deploy → Environment**
3. **Clica em "Edit variables"**
4. **Adiciona cada linha do .env** (7 no total)

Exemplo na interface:
```
Key: VITE_FIREBASE_API_KEY
Value: AIzaSyDaBcD1234efGH...

Key: VITE_FIREBASE_AUTH_DOMAIN
Value: vinheta-project123.firebaseapp.com

... (repete para as 7 variáveis)
```

---

## ⚠️ Checklist Final

Antes de fazer deploy:

- [ ] `.env` tem 7 variáveis preenchidas
- [ ] `.env` está em `.gitignore` (não vai para GitHub)
- [ ] `npm run dev` funciona localmente
- [ ] Netlify tem as 7 variáveis em Environment
- [ ] Deploy foi bem-sucedido

---

## 🆘 Se Algo Correr Mal

### Erro: "Cannot find module 'firebase'"

```bash
npm install
npm run dev
```

### Erro: "VITE_FIREBASE_API_KEY is undefined"

Verifica:
- O ficheiro `.env` existe
- Tem as variáveis preenchidas (sem erros de digitação)
- Reinicia o servidor: `npm run dev`

### Erro: "Anthropic API error 401"

- Verifica que a chave começa com `sk-ant-`
- Regenera uma nova chave em console.anthropic.com
- Atualiza em `.env`

---

**Pronto! Ficheiro `.env` preenchido = app funciona! 🚀**
