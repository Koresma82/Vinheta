# 🚀 NETLIFY - SETUP DE ENVIRONMENT VARIABLES

Guia completo para deploy em Netlify com variáveis de ambiente corretas.

---

## 📋 PASSO 1: OBTER AS CREDENCIAIS

### **Firebase**

1. Abre: https://console.firebase.google.com
2. Seleciona teu projeto
3. Vai a: ⚙️ **Configurações do Projeto** (canto superior direito)
4. Clica em: **Seu aplicativos** → **Web** 
5. Procura pela secção com `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbcd...",              ← VITE_FIREBASE_API_KEY
  authDomain: "vinheta-xxx.firebaseapp.com",  ← VITE_FIREBASE_AUTH_DOMAIN
  projectId: "vinheta-xxx",             ← VITE_FIREBASE_PROJECT_ID
  storageBucket: "vinheta-xxx.appspot.com",   ← VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012",    ← VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abcd..."   ← VITE_FIREBASE_APP_ID
};
```

**Copia cada valor!**

### **Anthropic API**

1. Abre: https://console.anthropic.com
2. Clica em: **API Keys**
3. Clica em: **Create Key**
4. Copia a chave completa: `sk-ant-v0-xxxxx...`
   - Esta é a tua: **VITE_ANTHROPIC_API_KEY**

---

## 📍 PASSO 2: NETLIFY - ADICIONAR VARIABLES

### **Se ainda não fizeste deploy:**

1. Abre: https://app.netlify.com
2. Clica: **Add new site** → **Import an existing project**
3. Conecta ao teu GitHub (autoriza Netlify)
4. Seleciona o repositório `vinheta-project`
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Clica em: **Show advanced** → **New variable**

### **Se já tens site em Netlify:**

1. Abre: https://app.netlify.com
2. Seleciona o site **vinheta**
3. Vai a: **Site settings** → **Build & deploy** → **Environment**
4. Clica: **Edit variables**

---

## 🔑 PASSO 3: ADICIONAR CADA VARIÁVEL

### **Método 1: Uma a Uma (Interface)**

Para cada variável abaixo:

1. Clica: **Add a variable**
2. Key: `VITE_FIREBASE_API_KEY` (exemplo)
3. Value: `AIzaSyAbcd...` (copia exato)
4. Clica: **Save**
5. Repete para todas as 7 variáveis

### **Método 2: Bulk Upload (Mais Rápido)**

Cria um ficheiro `netlify.env` com:

```
VITE_FIREBASE_API_KEY=AIzaSyAbcd1234...
VITE_FIREBASE_AUTH_DOMAIN=vinheta-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-xxx
VITE_FIREBASE_STORAGE_BUCKET=vinheta-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcd...
VITE_ANTHROPIC_API_KEY=sk-ant-v0-xxxxx...
```

Depois:
1. Vai a **Site settings** → **Build & deploy** → **Environment**
2. Clica... (procura opção bulk upload, se existir)
3. Ou copia-cola cada um manualmente

---

## 📝 VARIÁVEIS A ADICIONAR (7 total)

```
┌─────────────────────────────────────────────────┐
│ 1. VITE_FIREBASE_API_KEY                        │
│    Valor: AIzaSyAbcd1234efgh5678ijklmnop...     │
├─────────────────────────────────────────────────┤
│ 2. VITE_FIREBASE_AUTH_DOMAIN                    │
│    Valor: vinheta-xxxxx.firebaseapp.com         │
├─────────────────────────────────────────────────┤
│ 3. VITE_FIREBASE_PROJECT_ID                     │
│    Valor: vinheta-xxxxx                         │
├─────────────────────────────────────────────────┤
│ 4. VITE_FIREBASE_STORAGE_BUCKET                 │
│    Valor: vinheta-xxxxx.appspot.com             │
├─────────────────────────────────────────────────┤
│ 5. VITE_FIREBASE_MESSAGING_SENDER_ID            │
│    Valor: 123456789012                          │
├─────────────────────────────────────────────────┤
│ 6. VITE_FIREBASE_APP_ID                         │
│    Valor: 1:123456789012:web:abcd1234...       │
├─────────────────────────────────────────────────┤
│ 7. VITE_ANTHROPIC_API_KEY                       │
│    Valor: sk-ant-v0-xxxxx...                    │
└─────────────────────────────────────────────────┘
```

---

## 🔍 VERIFICAR SE TUDO ESTÁ CORRETO

Depois de adicionar todas as variáveis:

1. Vai a: **Deploys** 
2. Clica em: **Trigger deploy** → **Deploy site**
3. Espera o build completar
4. Se veres ✅ (green), está tudo bem!
5. Se veres ❌ (red), clica no deploy para ver erro

---

## 🧪 TESTAR A APP

Após deploy bem-sucedido:

1. Abre: `https://teu-site-vinheta.netlify.app`
2. Deveria aparecer a página de login
3. Clica: **Login com Google**
4. Faz login com a tua conta Google
5. Se abrir o Dashboard, tudo funciona! ✅

---

## ⚙️ PASSO 4: CONFIGURAR BUILDS

Se quiseres builds automáticos quando fazes push:

1. **Site settings** → **Build & deploy** → **Deploy contexts**
2. Verifica:
   - **Branch deploys**: `main` ✅
   - **Deploy previews**: `All` ✅
   - **Deploy on push**: ✅ ON

Agora cada `git push` ao main fará deploy automático!

---

## 🌍 DOMÍNIO CUSTOMIZADO (Opcional)

Se quiseres `vinheta.app` em vez de `vinheta.netlify.app`:

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Tipo de registo: `CNAME` (se usares Netlify DNS)
   - Host: `vinheta` → Points to: `vinheta.netlify.app`
4. Ou atualiza DNS provider com dados de Netlify

---

## 🔐 BEST PRACTICES

✅ **NUNCA commites credenciais ao Git!**
```bash
# .gitignore já tem:
.env
.env.production
.env.development
```

✅ **Variáveis diferentes para DEV e PROD:**
```
Desenvolvimento: .env.development (local)
Produção: Netlify environment variables
```

✅ **Rotar API keys regularmente:**
- A cada 3 meses, gera nova chave
- Atualiza em Netlify
- Remove a antiga

---

## 🐛 TROUBLESHOOTING DEPLOY

### ❌ "Build failed"
→ Verifica Console output em Deploy logs
→ Procura por "env" ou "undefined"

### ❌ "Login não funciona"
→ Verifica `VITE_FIREBASE_PROJECT_ID` está correto
→ Verifica Google Sign-In ativado em Firebase

### ❌ "Erro ao guardar vinhos"
→ Verifica `VITE_FIREBASE_STORAGE_BUCKET` correto
→ Verifica Firestore Rules e Storage Rules

### ❌ "Claude API error"
→ Verifica `VITE_ANTHROPIC_API_KEY` correto
→ Verifica limite de API usage em console.anthropic.com

---

## ✅ CHECKLIST NETLIFY

- [ ] Firebase credenciais copiadas
- [ ] Anthropic API key gerada
- [ ] 7 variáveis adicionadas em Netlify
- [ ] Build triggered
- [ ] Deploy com ✅ verde
- [ ] Login funciona
- [ ] Vinho guardado com sucesso
- [ ] Cache funciona (teste 2x mesmo prato)

---

## 📞 LINKS ÚTEIS

| Link | Para quê |
|------|----------|
| https://console.firebase.google.com | Credenciais Firebase |
| https://console.anthropic.com | Chave API Anthropic |
| https://app.netlify.com | Deploy e variables |
| https://support.netlify.com | Suporte Netlify |

---

**Pronto! Netlify está configurado com as variáveis corretas!** 🎉

Quando fazes `git push` → Netlify descarrega código → Injeta variáveis → Build & Deploy automático! 🚀
