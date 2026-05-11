# 🔐 SETUP DE VARIÁVEIS DE AMBIENTE

Guia completo para configurar credenciais em `.env` para desenvolvimento local e Netlify production.

---

## 🎯 RESUMO RÁPIDO

```
LOCAL (Desenvolvimento):
├─ Preenches .env.development
├─ npm run dev → lê variáveis locais
└─ Servidor em http://localhost:5173

NETLIFY (Produção):
├─ Adiciona variables em Netlify UI
├─ npm run build → injeta variáveis de Netlify
└─ Deploy automático em https://teu-site.netlify.app
```

---

## 📋 FICHEIROS .env

### **1. `.env.example`** (Template - não editar)
```
Serve como referência do que preencher
Commit ao Git ✅
```

### **2. `.env.development`** (Desenvolvimento local)
```
Ficheiro local com credenciais DEV
NÃO commita ao Git ❌ (.gitignore já protege)
Preenche com credenciais Firebase DEV
```

### **3. `.env.production`** (Referência apenas)
```
NÃO usar! Variáveis vêm do Netlify
Mantém como referência do que é necessário
```

### **Estrutura no Git**
```
vinheta-project/
├─ .env.example           ✅ COMMIT (template)
├─ .env.development       ❌ NÃO COMMIT (.gitignore)
├─ .env.production        ❌ NÃO COMMIT (.gitignore)
└─ .gitignore
   └─ .env*  (ignora todas as .env)
```

---

## 🛠️ PASSO 1: OBTER CREDENCIAIS

### **A) Firebase**

1. Abre: https://console.firebase.google.com
2. Seleciona o projeto
3. **⚙️ Configurações do Projeto** (canto superior direito)
4. **Seu aplicativos** → **Web** (seleciona a app)
5. Procura pela secção **firebaseConfig** e copia os valores:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbcd1234...",
  authDomain: "vinheta-dev.firebaseapp.com",
  projectId: "vinheta-dev",
  storageBucket: "vinheta-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh"
};
```

### **B) Anthropic API**

1. Abre: https://console.anthropic.com
2. **API Keys** → **Create Key**
3. Copia a chave: `sk-ant-v0-xxxxx...`

---

## 📝 PASSO 2: PREENCHER `.env.development`

Abre o ficheiro: `vinheta-project/.env.development`

```env
# ============================================
# VINHETA - DEV ENVIRONMENT
# ============================================

# Firebase Configuration (DEV)
VITE_FIREBASE_API_KEY=AIzaSyAbcd1234efgh5678ijklmnop-stu_vwxyz
VITE_FIREBASE_AUTH_DOMAIN=vinheta-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-dev
VITE_FIREBASE_STORAGE_BUCKET=vinheta-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcd1234efgh5678

# Anthropic API
VITE_ANTHROPIC_API_KEY=sk-ant-v0-abcd1234efgh5678ijklmnopqr
```

**Importantes:**
- Sem espaços antes/depois do `=`
- Sem aspas à volta dos valores
- Um par por linha
- Salva o ficheiro

---

## ✅ PASSO 3: VERIFICAR LOCAL

Executa em desenvolvimento:

```bash
cd vinheta-project

# Instala dependências
npm install

# Inicia servidor
npm run dev
```

Se vires na consola:
```
✅ Local: http://localhost:5173
```

Abre o browser, faz login com Google e testa.

---

## 🚀 PASSO 4: DEPLOY EM NETLIFY

### **Opção A: Primeiro Deploy**

```bash
# 1. Build local
npm run build

# 2. Abre Netlify
# https://app.netlify.com

# 3. "Add new site" → "Deploy manually"

# 4. Arrasta a pasta "dist"

# 5. Site criado! (terá URL aleatório)
```

### **Opção B: Deploy via GitHub (Recomendado)**

```bash
# 1. Push ao GitHub
git add .
git commit -m "Setup vinheta with env variables"
git push origin main

# 2. Netlify conecta automaticamente

# 3. Build automático na cada push
```

---

## 🔑 PASSO 5: ADICIONAR VARIABLES EM NETLIFY

Depois de criar o site em Netlify:

### **Metodo Manual (Recomendado)**

1. Abre: https://app.netlify.com
2. Seleciona o site **vinheta**
3. **Site settings** → **Build & deploy** → **Environment**
4. Clica: **Edit variables**

Para cada variável abaixo, clica **Add a variable**:

```
Key: VITE_FIREBASE_API_KEY
Value: AIzaSyAbcd1234efgh5678ijklmnop-stu_vwxyz
[Save]

Key: VITE_FIREBASE_AUTH_DOMAIN  
Value: vinheta-dev.firebaseapp.com
[Save]

Key: VITE_FIREBASE_PROJECT_ID
Value: vinheta-dev
[Save]

Key: VITE_FIREBASE_STORAGE_BUCKET
Value: vinheta-dev.appspot.com
[Save]

Key: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789012
[Save]

Key: VITE_FIREBASE_APP_ID
Value: 1:123456789012:web:abcd1234efgh5678
[Save]

Key: VITE_ANTHROPIC_API_KEY
Value: sk-ant-v0-abcd1234efgh5678ijklmnopqr
[Save]
```

### **Screenshot Guide**

```
1. Site Settings → Build & deploy → Environment

┌─────────────────────────────────────┐
│ Environment Variables               │
├─────────────────────────────────────┤
│ [Edit variables]                    │
│                                     │
│ VITE_FIREBASE_API_KEY               │
│ Value: [AIzaSyAbcd...]  [Delete]    │
│                                     │
│ VITE_FIREBASE_AUTH_DOMAIN           │
│ Value: [vinheta-dev...]  [Delete]   │
│                                     │
│ ... (mais 5 variáveis)              │
│                                     │
│ [Add a variable]                    │
└─────────────────────────────────────┘
```

---

## 🔄 PASSO 6: TRIGGER DEPLOY

Depois de adicionar as variáveis:

1. **Deploys** tab
2. **Trigger deploy** → **Deploy site**
3. Espera ~2-5 minutos
4. Se vires ✅ verde = sucesso!
5. Se vires ❌ vermelho = clica para ver erro

---

## 🧪 TESTAR PRODUCTION

Após deploy bem-sucedido:

1. Abre: `https://teu-site-vinheta.netlify.app` (URL do Netlify)
2. Deveria carregar página de login
3. **Login com Google**
4. Deveria abrir o Dashboard
5. **Adiciona um vinho** (testa upload + Firebase)
6. **Testa Sommelier** (testa Claude API)

Se tudo funcionar → Parabéns! ✅

---

## 📊 COMPARAÇÃO: DEV vs PROD

| Aspecto | Desenvolvimento | Produção (Netlify) |
|---------|-----------------|-------------------|
| Variáveis em | `.env.development` | Netlify UI |
| Quando lê | `npm run dev` | `npm run build` |
| Onde | localhost:5173 | https://site.netlify.app |
| Cache | Falso (sempre recompila) | Verdadeiro |
| Logs | Console local | Netlify logs |
| Acesso | http:// | https:// ✅ |
| Firebase Rules | Teste | Production |

---

## 🔐 SEGURANÇA

### ✅ O QUE FAZER

```bash
# Commita template
git add .env.example
git commit -m "Add env template"

# Ignora credenciais (automático)
# .gitignore já tem: .env*
```

### ❌ O QUE NÃO FAZER

```bash
# NUNCA commitas credenciais!
git add .env.development  # ❌ PERIGOSO!
git add .env.production   # ❌ PERIGOSO!

# Se fizeste por acaso:
git rm --cached .env*
git commit -m "Remove env files"
git push
```

---

## 🔀 MÚLTIPLOS AMBIENTES

Se tiveres **DEV** e **PROD** em Firebase separados:

### **Ficheiro Local**
```
.env.development
└─ Credenciais Firebase DEV
```

### **Netlify Production**
```
Environment Variables
└─ Credenciais Firebase PROD
```

### **Como alternar**

**Local → DEV:**
```bash
npm run dev
```

**Build → PROD:**
```bash
npm run build
# Injeta variáveis de Netlify
```

---

## 📝 CHECKLIST

- [ ] Credenciais Firebase copiadas
- [ ] Chave Anthropic API gerada
- [ ] `.env.development` preenchido
- [ ] `npm install` completado
- [ ] `npm run dev` funciona localmente
- [ ] Login Google funciona em localhost
- [ ] Vinho guardado com sucesso em DEV
- [ ] Site criado em Netlify
- [ ] 7 variáveis adicionadas em Netlify
- [ ] Deploy triggered em Netlify
- [ ] Deploy com ✅ verde
- [ ] Login Google funciona em PROD
- [ ] Cache funciona (mesmo prato 2x)

---

## 🆘 TROUBLESHOOTING

### **Local: "Cannot find module"**
```
npm install
npm run dev
```

### **Local: "Undefined variable"**
```
Verifica .env.development está preenchido
Reinicia o servidor: npm run dev
```

### **Netlify: Build failed**
```
Vai a Deploys → últimabuilds → View logs
Procura por "env" ou "undefined"
Verifica variáveis em Environment
```

### **Netlify: Login não funciona**
```
Verifica VITE_FIREBASE_PROJECT_ID está correto
Verifica Google Sign-In ativado em Firebase
Verifica Auth Domain está correto
```

---

## 📞 SUPORTE

| Problema | Solução |
|----------|---------|
| Credenciais erradas | Copia exatamente do Firebase Console |
| Ficheiro .env não existe | Cria a partir de `.env.example` |
| Variáveis não lidas | Reinicia `npm run dev` |
| Netlify não injeta vars | Recarrega página ou trigga novo deploy |
| API rate limit | Verifica `console.anthropic.com` usage |

---

**Tudo pronto! Tanto local como Netlify funcionam com variáveis de ambiente! 🎉**
