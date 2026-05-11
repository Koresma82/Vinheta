# 🔄 MULTI-ENVIRONMENT SETUP - DEV / TEST / PROD

Guia completo para trabalhar com 3 ambientes Firebase diferentes.

---

## 📊 OS 3 AMBIENTES

| Ambiente | Projeto Firebase | Ficheiro | Uso |
|----------|-----------------|----------|-----|
| **DEV** | `vinhetadev` | `.env.development` | Desenvolvimento local |
| **TEST** | `vinhetatest` | `.env.test` | Testes (Netlify preview) |
| **PROD** | `vinheta-3dd20` | `.env.production` | Produção (Netlify) |

---

## 🛠️ DESENVOLVIMENTO LOCAL (DEV)

### **Usar DEV localmente:**

```bash
npm run dev
# Lê: .env.development
# Firebase: vinhetadev
# URL: http://localhost:5173
```

### **O que vai acontecer:**

```
npm run dev
  ↓
Vite lê .env.development
  ↓
firebase.js carrega credenciais DEV
  ↓
Conecta a Firebase DEV (vinhetadev)
  ↓
Dados guardados em Firebase DEV
```

### **Credenciais DEV (já preenchidas)**

```env
# .env.development
VITE_FIREBASE_PROJECT_ID=vinhetadev
VITE_FIREBASE_STORAGE_BUCKET=vinhetadev.firebasestorage.app
```

---

## 🧪 TESTES / PREVIEW (TEST)

### **Para testar antes de produção:**

```bash
# Mudar para TEST (novo!)
npm run dev:test
# Lê: .env.test
# Firebase: vinhetatest
# URL: http://localhost:5173
```

### **Ou manualmente:**

```bash
# Definir variável de ambiente
export VITE_ENV=test
npm run dev
```

### **Em Netlify (Deploy Preview):**

Quando fazes PR no GitHub → Netlify cria preview
- Netlify deve estar configurado para usar `vinhetatest` em branches de feature

### **Credenciais TEST (já preenchidas)**

```env
# .env.test
VITE_FIREBASE_PROJECT_ID=vinhetatest
VITE_FIREBASE_STORAGE_BUCKET=vinhetatest.firebasestorage.app
```

---

## 🚀 PRODUÇÃO (PROD)

### **Para deploy final:**

```bash
npm run build
# Webpack lê variáveis de Netlify
# Firebase: vinheta-3dd20 (injetado por Netlify)
# URL: https://vinheta.netlify.app
```

### **Em Netlify:**

1. Site Settings → Build & deploy → Environment
2. Adiciona as **7 variáveis PROD**:

```
VITE_FIREBASE_API_KEY=AIzaSyChB4pCF1htSA__PNISDuUG9jS32mEtwAc
VITE_FIREBASE_AUTH_DOMAIN=vinheta-3dd20.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-3dd20
VITE_FIREBASE_STORAGE_BUCKET=vinheta-3dd20.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1066674374174
VITE_FIREBASE_APP_ID=1:1066674374174:web:0c1659f3f0ffc066d5500f
VITE_ANTHROPIC_API_KEY=sk-ant-v0-YOUR_KEY_HERE
```

### **Credenciais PROD (já preenchidas)**

```env
# .env.production
VITE_FIREBASE_PROJECT_ID=vinheta-3dd20
VITE_FIREBASE_STORAGE_BUCKET=vinheta-3dd20.firebasestorage.app
```

---

## 🔧 ESTRUTURA DE FICHEIROS

```
vinheta-project/
├─ .env.example           (template)
├─ .env.development       ✅ DEV (preenchido)
├─ .env.test             ✅ TEST (preenchido)
├─ .env.production       ✅ PROD (preenchido)
├─ vite.config.js        (configuração Vite)
└─ src/firebase.js       (lê variáveis)
```

---

## 📝 RESUMO DE CREDENCIAIS

### **DEV - vinhetadev**
```
API Key: AIzaSyBz9fYQE-p9hxaNYYVfRpCZge9RU55HP1I
Project: vinhetadev
Storage: vinhetadev.firebasestorage.app
```

### **TEST - vinhetatest**
```
API Key: AIzaSyBBB-76gJRP5zCf3vxQwC-ljjIXA9ScHzE
Project: vinhetatest
Storage: vinhetatest.firebasestorage.app
```

### **PROD - vinheta-3dd20**
```
API Key: AIzaSyChB4pCF1htSA__PNISDuUG9jS32mEtwAc
Project: vinheta-3dd20
Storage: vinheta-3dd20.firebasestorage.app
```

---

## 🔄 FLUXO COMPLETO

```
1. DESENVOLVIMENTO (Local)
   ├─ npm run dev
   ├─ Lê: .env.development
   └─ Firebase: vinhetadev

2. TESTES (Local ou Preview)
   ├─ npm run dev:test
   ├─ Lê: .env.test
   └─ Firebase: vinhetatest

3. BUILD (Local para testar)
   ├─ npm run build
   ├─ Lê: .env.production (para testar)
   └─ Firebase: vinheta-3dd20

4. DEPLOY (Netlify)
   ├─ Git push
   ├─ Netlify build (injeta vars)
   ├─ Firebase: vinheta-3dd20
   └─ Live em https://vinheta.netlify.app
```

---

## ✅ CHECKLIST

- [ ] `.env.development` preenchido (DEV)
- [ ] `.env.test` preenchido (TEST)
- [ ] `.env.production` preenchido (PROD)
- [ ] `npm run dev` funciona (lê DEV)
- [ ] `npm run dev:test` funciona (lê TEST)
- [ ] `npm run build` funciona (lê PROD)
- [ ] Netlify tem 7 variáveis PROD
- [ ] Deploy Netlify funciona (PROD)

---

## 🐛 TROUBLESHOOTING

### **P: Como sei qual ambiente estou a usar?**

**R:** Verifica o `firebase.js` - o `projectId` diz tudo:

```javascript
// Se vires no console:
// projectId: "vinhetadev" → DEV ✓
// projectId: "vinhetatest" → TEST ✓
// projectId: "vinheta-3dd20" → PROD ✓
```

### **P: Mudei o .env mas não funciona?**

**R:** Reinicia o servidor:
```bash
# Para o servidor (Ctrl+C)
npm run dev
# Começa de novo
```

### **P: Como testolocalmente com PROD?**

**R:** Copia .env.production para .env.development temporariamente:
```bash
cp .env.production .env.development
npm run dev
```

### **P: Dados de DEV têm sido misturados com TEST?**

**R:** Verifica qual Firebase está ativo:
```javascript
// Em Firebase Console, verifica qual projeto está aberto
// DEV: https://console.firebase.google.com/project/vinhetadev
// TEST: https://console.firebase.google.com/project/vinhetatest
// PROD: https://console.firebase.google.com/project/vinheta-3dd20
```

---

## 🔐 SEGURANÇA

### ✅ O QUE FAZER

```
.env.development   ← NÃO commita (.gitignore)
.env.test          ← NÃO commita (.gitignore)
.env.production    ← NÃO commita (.gitignore)
.env.example       ← COMMITA (template)
```

### ❌ O QUE NÃO FAZER

```
git add .env*      ← ❌ PERIGOSO!
git push           ← ❌ Expõe credenciais!
```

---

## 🎯 PRÓXIMOS PASSOS

### **1. Local (DEV)**
```bash
npm install
npm run dev
# Testa em http://localhost:5173
```

### **2. Testar (TEST - opcional)**
```bash
npm run dev:test
# Testa com Firebase TEST
```

### **3. Build (PROD)**
```bash
npm run build
# Cria pasta dist pronta para Netlify
```

### **4. Deploy (Netlify)**
```
1. Netlify Site Settings → Add 7 variables (PROD)
2. Git push
3. Deploy automático
4. Testa em https://vinheta.netlify.app
```

---

## 📞 RESUMO

| Preciso fazer | Comando | Ficheiro lido |
|---------------|---------|---------------|
| Desenvolviment local | `npm run dev` | `.env.development` |
| Testar com TEST | `npm run dev:test` | `.env.test` |
| Build para PROD | `npm run build` | `.env.production` |
| Deploy em Netlify | Git push | Netlify variables |

---

**Agora tens 3 ambientes Firebase separados e bem organizados!** 🎉

Cada um com seus dados, isolado, sem risco de misturar!
