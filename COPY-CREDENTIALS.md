# 📋 COMO COPIAR CREDENCIAIS CORRETAMENTE

Guia visual passo-a-passo para copiar credenciais do Firebase e Anthropic.

---

## 🔥 FIREBASE - PASSO A PASSO

### **PASSO 1: Abre Firebase Console**

```
https://console.firebase.google.com
```

Deverás ver a lista dos teus projetos.

---

### **PASSO 2: Seleciona o projeto Vinheta**

Clica no projeto que criaste (ex: "vinheta-app").

---

### **PASSO 3: Abre Project Settings**

No canto superior direito, procura o ícone ⚙️ (engrenagem):

```
┌──────────────────────────────────────┐
│ FIREBASE PROJECT           ⚙️ Settings│
└──────────────────────────────────────┘
```

Clica em **⚙️ Configurações do Projeto**

---

### **PASSO 4: Vai a "Seu aplicativos"**

Na página de settings, procura **"Seu aplicativos"** (abaixo de Project Name).

Verás algo como:
```
┌─────────────────────────────────────┐
│ 🌐 Seu aplicativos                  │
│                                     │
│ Nome         Tipo      Criado em    │
│ ─────────────────────────────────── │
│ vinheta-app  WEB      2026-05-06   │
│ (outro)      APPLE    2026-05-05   │
└─────────────────────────────────────┘
```

Clica na tua app **WEB** (vinheta-app).

---

### **PASSO 5: Copia o firebaseConfig**

Procura a secção com um código assim:

```javascript
// For Firebase JS SDK v7.20.0 and later, measure performance of your app
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbcd1234efgh5678ijklmnop-stu_vwxyz",
  authDomain: "vinheta-dev.firebaseapp.com",
  projectId: "vinheta-dev",
  storageBucket: "vinheta-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcd1234efgh5678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

---

### **PASSO 6: Extrai os valores**

De `firebaseConfig`, copia APENAS os valores:

```
apiKey: "AIzaSyAbcd1234efgh5678ijklmnop-stu_vwxyz"
        └─ Copia isto → VITE_FIREBASE_API_KEY

authDomain: "vinheta-dev.firebaseapp.com"
            └─ Copia isto → VITE_FIREBASE_AUTH_DOMAIN

projectId: "vinheta-dev"
           └─ Copia isto → VITE_FIREBASE_PROJECT_ID

storageBucket: "vinheta-dev.appspot.com"
               └─ Copia isto → VITE_FIREBASE_STORAGE_BUCKET

messagingSenderId: "123456789012"
                   └─ Copia isto → VITE_FIREBASE_MESSAGING_SENDER_ID

appId: "1:123456789012:web:abcd1234efgh5678"
       └─ Copia isto → VITE_FIREBASE_APP_ID
```

---

### **PASSO 7: Preenche o .env**

Abre o ficheiro `.env.development`:

```env
VITE_FIREBASE_API_KEY=AIzaSyAbcd1234efgh5678ijklmnop-stu_vwxyz
VITE_FIREBASE_AUTH_DOMAIN=vinheta-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-dev
VITE_FIREBASE_STORAGE_BUCKET=vinheta-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcd1234efgh5678
```

**Importante:** Sem aspas! Sem espaços! Exatamente como copiaste.

---

## 🤖 ANTHROPIC API - PASSO A PASSO

### **PASSO 1: Abre Anthropic Console**

```
https://console.anthropic.com
```

Deverás estar autenticado com a tua conta.

---

### **PASSO 2: Vai a "API Keys"**

Na navegação lateral esquerda, clica em **API Keys** ou acede a:

```
https://console.anthropic.com/account/keys
```

---

### **PASSO 3: Clica "Create Key"**

Procura o botão **Create Key** ou **+ Create new key**:

```
┌──────────────────────────────────┐
│ API KEYS                         │
├──────────────────────────────────┤
│ [+ Create Key]                   │
│                                  │
│ Default key    sk-ant-v0-a...   │
│                [Copy] [Delete]   │
└──────────────────────────────────┘
```

---

### **PASSO 4: Copia a chave**

Após criar, verás:

```
┌──────────────────────────────────────────────┐
│ New API Key Created                          │
│                                              │
│ sk-ant-v0-abcd1234efgh5678ijklmnopqr...    │
│                                              │
│ [Copy to clipboard]                          │
│                                              │
│ ⚠️ Save this key now - it won't be shown   │
│    again!                                    │
└──────────────────────────────────────────────┘
```

Clica **[Copy to clipboard]** para copiar a chave completa.

---

### **PASSO 5: Preenche o .env**

Abre `.env.development` e preenche:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-v0-abcd1234efgh5678ijklmnopqr
```

(Cola a chave que copiaste)

---

## ✅ VERIFICAÇÃO FINAL

Depois de preencher tudo:

```env
# .env.development - Verificação

✅ VITE_FIREBASE_API_KEY=AIzaSyAbcd1234...
   └─ Começa com: AIzaSy

✅ VITE_FIREBASE_AUTH_DOMAIN=vinheta-xxx.firebaseapp.com
   └─ Contém: .firebaseapp.com

✅ VITE_FIREBASE_PROJECT_ID=vinheta-xxx
   └─ Sem espaços, sem caracteres especiais

✅ VITE_FIREBASE_STORAGE_BUCKET=vinheta-xxx.appspot.com
   └─ Contém: .appspot.com

✅ VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   └─ Apenas números

✅ VITE_FIREBASE_APP_ID=1:123456789012:web:abcd...
   └─ Começa com: 1:

✅ VITE_ANTHROPIC_API_KEY=sk-ant-v0-...
   └─ Começa com: sk-ant-v0
```

---

## 📋 COPIAR PARA NETLIFY

Quando fores fazer deploy em Netlify, os mesmos valores vão em **Environment Variables**:

### **Interface Netlify:**

```
https://app.netlify.com
→ Site settings
→ Build & deploy
→ Environment
→ Edit variables

Para cada valor acima, adiciona como:
Key: VITE_FIREBASE_API_KEY
Value: [copia o valor de .env.development]
[Save]
```

---

## ❓ DÚVIDAS COMUNS

### **P: As aspas fazem parte do valor?**
**R:** NÃO! Se vires em Firebase:
```
apiKey: "AIzaSyAbcd..."
        ↑ Aspas são apenas de formatação JavaScript
```
Copia só o que está dentro das aspas!

### **P: Há espaços no valor?**
**R:** Alguns valores têm espaços? Não! Copia exatamente como está.

### **P: Fiz cópia errada, o que fazer?**
**R:** Volta ao Firebase/Anthropic e copia novamente. Não há problema!

### **P: A chave Anthropic é visível em produção?**
**R:** NÃO! Fica guardada segura em Netlify, nunca aparece no código enviado.

---

## 🚀 PRÓXIMOS PASSOS

Depois de preencher:

```bash
# 1. Verifica .env.development
cat .env.development

# 2. Inicia servidor
npm run dev

# 3. Testa login
# Abre http://localhost:5173
```

Se vires a página de login → Tudo certo! ✅

---

**Agora tens todas as credenciais preenchidas corretamente!** 🎉
