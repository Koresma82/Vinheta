# 🚀 Guia de Setup Rápido - Vinheta

## 1️⃣ Criar Projeto Firebase

1. Aceder a [Firebase Console](https://console.firebase.google.com)
2. Clica em "Criar projeto"
3. Nome: `vinheta` → Continue
4. Desativa Google Analytics → Criar projeto
5. Aguarda conclusão

## 2️⃣ Ativar Firestore

1. No Firebase Console, clica em "Firestore Database"
2. "Create Database"
3. Modo: **Iniciar em modo de teste** (depois configuraremos as regras)
4. Localização: `eur3` (Europa)
5. "Create"

## 3️⃣ Ativar Storage

1. No Firebase Console, clica em "Storage"
2. "Get Started"
3. Modo de teste
4. Localização: `eur3`
5. "Done"

## 4️⃣ Ativar Google Sign-In

1. No Firebase, clica em "Authentication"
2. "Get started"
3. "Sign-in method"
4. Clica em "Google"
5. Ativa e adiciona email de suporte
6. "Save"

## 5️⃣ Obter Credenciais

1. No Firebase, clica na ⚙️ (Project settings)
2. Clica em "Your apps"
3. Seleciona a app web (ou cria uma)
4. Copia todo o código de configuração

Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "vinheta-xxxxx.firebaseapp.com",
  projectId: "vinheta-xxxxx",
  storageBucket: "vinheta-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```

## 6️⃣ Clonar e Instalar

```bash
git clone https://github.com/koresma/vinheta.git
cd vinheta
npm install
```

## 7️⃣ Configurar .env

```bash
cp .env.example .env
```

Edita `.env` e adiciona:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=vinheta-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=vinheta-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## 8️⃣ Configurar Regras Firestore

1. Firebase Console → Firestore → "Rules"
2. Substitui com:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      match /recommendations/{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

3. Publish

## 9️⃣ Configurar Regras Storage

1. Firebase Console → Storage → "Rules"
2. Substitui com:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wine-photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

3. Publish

## 🔟 Testar Localmente

```bash
npm run dev
```

Abre `http://localhost:3000` e testa o login com Google

## 1️⃣1️⃣ Fazer Push para GitHub

```bash
git add .
git commit -m "Initial commit - Vinheta"
git branch -M main
git push -u origin main
```

## 1️⃣2️⃣ Deploy no Netlify

1. Aceder a [netlify.com](https://netlify.com)
2. Login com GitHub
3. "New site from Git"
4. Autoriza GitHub
5. Seleciona repositório `vinheta`
6. Clica "Deploy site"
7. Vai a "Site settings" → "Build & deploy" → "Environment"
8. Adiciona todas as variáveis do `.env`

Netlify detecta automaticamente:
- Build command: `npm run build`
- Publish directory: `dist`

## 1️⃣3️⃣ Configurar Domínio (Opcional)

1. No Netlify, vai a "Site settings" → "Domain management"
2. Clica em "Add custom domain"
3. Adiciona teu domínio

## ✅ Pronto!

A app está em produção! 🎉

Acesso:
- **Netlify**: `https://vinheta-xxxxx.netlify.app`
- **Custom domain**: `https://teudominio.com` (se configurado)

## 📝 Notas Importantes

- **Never commit `.env`** - O `.gitignore` protege, mas confirma
- **Firebase no modo teste** - Segue as regras que configuraste (é seguro com as regras acima)
- **Quotas gratuitas** - Firebase e Netlify têm planos gratuitos generosos
- **Anthropic API** - Tens que ter saldo ou modo de teste ativado

## 🔒 Próximo Passo: Segurança

1. Firebase → "Project settings" → "App passwords" (criar senhas específicas)
2. Configurar Custom domain no Netlify para melhor branding
3. Adicionar Google Analytics (opcional)
4. Backup das rules em local (git)

---

Qualquer dúvida, abre uma issue no GitHub! 🍷
