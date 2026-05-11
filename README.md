# 🍷 Vinheta - Sommelier IA

Descobre o vinho perfeito para a tua refeição com inteligência artificial! Carrega uma foto dos teus vinhos ou de uma carta, escreve o prato e o nosso Sommelier IA recomenda-te o melhor vinho com base no teu orçamento.

## ✨ Funcionalidades

- **Autenticação Google**: Login seguro com conta Google
- **Análise IA com Claude Vision**: Analisa fotos de vinhos para identificar variedades
- **Recomendações Personalizadas**: Sugestões baseadas no prato e budget
- **Histórico de Recomendações**: Guarda todas as tuas sugestões no Firebase
- **Storage de Fotos**: Mantém cópias das fotos dos vinhos
- **Interface Elegante**: Design sofisticado e intuitivo

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite 5
- **Autenticação**: Firebase Auth (Google Sign-In)
- **Base de Dados**: Firestore
- **Storage**: Firebase Storage
- **IA**: Claude API (Claude Sonnet 4)
- **Hosting**: Netlify
- **Versionamento**: Git/GitHub

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Google
- Conta Firebase
- Conta GitHub
- Conta Netlify

## 🔧 Instalação

### 1. Clonar repositório

```bash
git clone https://github.com/koresma/vinheta.git
cd vinheta
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Firebase

1. Aceder a [Firebase Console](https://console.firebase.google.com)
2. Criar novo projeto: `vinheta`
3. Ativar Firestore Database
4. Ativar Firebase Storage
5. Ativar Google Sign-In (Authentication > Sign-in method)
6. Copiar credenciais do projeto

### 4. Configurar variáveis de ambiente

Criar `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

Preencher com as credenciais do Firebase:

```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=vinheta-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=vinheta-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=vinheta-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 5. Executar localmente

```bash
npm run dev
```

A app abre em `http://localhost:3000`

## 📊 Estrutura Firestore

```
users/{userId}
  ├── recommendations/
  │   ├── {docId}
  │   │   ├── dish: string
  │   │   ├── budgetMin: number
  │   │   ├── budgetMax: number
  │   │   ├── recommendation: string
  │   │   ├── imageUrl: string (opcional)
  │   │   └── createdAt: timestamp
```

## 🛠️ Regras Firestore

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

## 🎨 Estrutura do Projeto

```
vinheta/
├── src/
│   ├── components/
│   │   └── WinePairingForm.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── AuthContext.jsx
│   ├── firebase.js
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
├── netlify.toml
└── README.md
```

## 🚀 Deploy no Netlify

### 1. Fazer push para GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Conectar no Netlify

1. Aceder a [Netlify](https://netlify.com)
2. "New site from Git"
3. Selecionar repositório GitHub
4. Build command: `npm run build`
5. Publish directory: `dist`

### 3. Adicionar variáveis de ambiente

No Netlify Dashboard:
- Site settings > Build & deploy > Environment
- Adicionar todas as variáveis do `.env`

## 🔐 Segurança

- ✅ API keys do Firebase seguras em variáveis de ambiente
- ✅ Autenticação obrigatória para aceder aos dados
- ✅ Regras Firestore restringem acesso aos dados do utilizador
- ✅ HTTPS automático no Netlify
- ✅ CSP headers configurados

## 📱 Responsivo

A app funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🐛 Troubleshooting

### "Firebase config error"
- Verifica as variáveis de ambiente
- Confirma que copiaste as credenciais corretamente

### "Google Sign-In fails"
- Verifica que Google Sign-In está ativado em Firebase
- Confirma que o domínio está autorizado

### "Image upload fails"
- Verifica as regras do Firebase Storage
- Confirma que Storage está ativado

### "Recommendation API error"
- Verifica a chave da API Anthropic
- Confirma que tens quota disponível

## 📝 Firestore Storage Rules

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

## 🔄 Fluxo da Aplicação

1. **Login**: Utilizador faz login com Google
2. **Entrada**: Escreve o prato e define orçamento
3. **Upload (opcional)**: Carrega foto dos vinhos
4. **Análise IA**: Claude analisa a imagem e gera recomendação
5. **Resultado**: Mostra recomendação detalhada
6. **Guardar**: Recomendação é guardada no Firestore

## 📈 Próximas Features

- [ ] Histórico de recomendações com filtros
- [ ] Ratings e favorites
- [ ] Partilha de recomendações
- [ ] Integração com lojas de vinhos
- [ ] Notas de prova do utilizador
- [ ] Recomendações por região
- [ ] API própria de pareamentos

## 👥 Contribuir

1. Fork o repositório
2. Criar branch feature: `git checkout -b feature/novo-feature`
3. Commit: `git commit -m "Adiciona novo feature"`
4. Push: `git push origin feature/novo-feature`
5. Pull Request

## 📄 Licença

MIT - Desenvolvido por Koresma

## 📞 Suporte

Para dúvidas ou sugestões, contacta através do GitHub Issues.

---

**Desenvolvido com ❤️ por Koresma**
