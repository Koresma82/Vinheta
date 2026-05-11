# 🎨 GUIA DE ASSETS - VINHETA

Documentação sobre os logos, ícones e imagens da app.

---

## 📁 Estrutura de Assets

```
public/
├── assets/
│   ├── instagram/
│   │   └── vinheta-logo-completo.png      (1080x1080 - Social media)
│   └── icons/
│       ├── vinheta-favicon.png            (32x32 - Browser tab)
│       ├── vinheta-icon-192.png           (192x192 - Home screen)
│       ├── vinheta-icon-512.png           (512x512 - Splash screen)
│       ├── vinheta-icon-maskable-192.png  (192x192 - Adaptive icon)
│       └── vinheta-icon-maskable-512.png  (512x512 - Adaptive icon)
├── logo.png                               (Original - compatibilidade)
└── manifest.json                          (PWA config)
```

---

## 🖼️ Imagens Recebidas

### 1️⃣ Logo Completo (Instagram)

**Ficheiro**: `vinheta-logo-completo.png`
**Tamanho**: 1080x1080 (recomendado para Instagram)
**Uso**: 
- Instagram (feed, stories, bio)
- Website (sobre, marketing)
- Materiais de marketing
- Apresentações

**Características**:
- Nome completo "vinheta"
- Tagline: "O VINHO CERTO PARA O SEU PRATO"
- Background creme claro
- Completo com contexto

---

### 2️⃣ Ícones (4 variantes)

A imagem contém 4 variações:

#### A) FAV ICON (Apenas "V")
**Tamanho**: 32x32 pixels
**Uso**: 
- Favicon no browser (abrir/tab)
- Bookmark icon
- Pequenas representações

**Características**:
- Apenas a letra "V" em estilo taça de vinho
- Background creme
- Simples e elegante
- Função: identificação rápida

---

#### B) APP ICON (Taça completa - Sem label)
**Tamanho**: 192x192 ou 512x512
**Uso**:
- Home screen do telemóvel
- App store
- Atalho desktop
- PWA (Progressive Web App)

**Características**:
- Taça com vinho e prato
- Sem texto
- Background creme
- Perfeito para ícone app

---

#### C) APP ICON COM LABEL
**Tamanho**: 192x192 ou 512x512
**Uso**:
- Variação com nome "vinheta"
- Drawer de apps
- Algumas plataformas PWA

---

## 🛠️ Como Extrair os Ícones

### Opção 1: Usar Ferramenta Online

1. Aceder a: https://www.favicon-generator.org/
2. Upload da imagem `vinheta-icons.png`
3. Crop/select a variante que quiseres
4. Gera em múltiplos tamanhos
5. Download ZIP

### Opção 2: Design Tool (Recomendado)

1. Abrir em Figma / Adobe XD / Photoshop
2. Para FAV ICON:
   - Seleciona apenas o "V"
   - Exporta como 32x32 PNG
3. Para APP ICON:
   - Seleciona a taça completa
   - Exporta em 192x192 e 512x512

### Opção 3: Online Editor

1. Aceder a: https://photopea.com
2. Upload `vinheta-icons.png`
3. Crop a parte que quiseres
4. Image > Scale Image > 32x32 (favicon) ou 192x192 (app)
5. Export PNG

---

## 📱 PWA (Progressive Web App)

### O Que É?

Uma "app" que se instala no telemóvel como qualquer outra app, mas é uma web page.

### Como Funciona?

```
1. Utilizador acede a https://vinheta.app
2. Browser mostra notificação: "Instalar app"
3. Utilizador clica "Instalar"
4. Cria atalho no home screen
5. Ao abrir, aparece com o app icon
6. Funciona offline (com service worker)
```

### Configurado em:

- `manifest.json` - Metadados da app
- `index.html` - Meta tags PWA
- Icons nos tamanhos corretos

---

## 🎯 Tamanhos Recomendados

| Uso | Tamanho | Formato | Ficheiro |
|-----|---------|---------|----------|
| **Browser Tab** | 32x32 | PNG | `vinheta-favicon.png` |
| **Home Screen (pequeno)** | 192x192 | PNG | `vinheta-icon-192.png` |
| **Home Screen (grande)** | 512x512 | PNG | `vinheta-icon-512.png` |
| **Adaptive (pequeno)** | 192x192 | PNG | `vinheta-icon-maskable-192.png` |
| **Adaptive (grande)** | 512x512 | PNG | `vinheta-icon-maskable-512.png` |
| **Instagram** | 1080x1080 | JPG | `vinheta-logo-completo.jpg` |
| **Stories IG** | 1080x1920 | PNG | `vinheta-story.png` |

---

## 🚀 Próximos Passos

### HOJE:

1. **Extrair os ícones** da imagem recebida
2. **Criar os ficheiros** nos tamanhos corretos:
   - `vinheta-favicon.png` (32x32)
   - `vinheta-icon-192.png` (192x192)
   - `vinheta-icon-512.png` (512x512)
   - (Maskable versions idem)

3. **Guardar em**: `public/assets/icons/`

### Verificação:

```bash
ls -la public/assets/icons/
# Deve ter 6 ficheiros PNG
```

### Testar:

1. `npm run dev`
2. Abre http://localhost:3000
3. Abre DevTools (F12)
4. Application tab
5. Manifest → Verifica se carrega
6. Icons → Verifica se aparecem

---

## 📊 Instagram Strategy

### Feed Post

**Tamanho**: 1080x1080 (quadrado)
**Ficheiro**: `vinheta-logo-completo.png`

**Legenda Example**:
```
🍷 Vinheta - Sommelier IA

O vinho certo para o seu prato!

Descobre recomendações de vinhos 
personalizadas baseadas no prato 
e no teu orçamento.

Com análise de IA, foto dos teus 
vinhos ou carta de restaurante.

🔗 Link na bio
#VinhoPortuguês #SommelierIA #Vinheta
```

### Stories

**Tamanho**: 1080x1920 (vertical)
**Dica**: Add text overlay: "Abre agora!"

### Bio

**Photo**: Favicon ou app icon quadrado
**Bio Text**: "Sommelier IA 🍷 O vinho certo para o seu prato"

---

## 🎨 Brand Colors

- **Burgundy/Vinho**: #8b3a3a (cor principal)
- **Dourado/Ouro**: #d4af37 (acentos)
- **Creme**: #f5f5f0 (background)
- **Branco**: #ffffff (texto)

Use em:
- Social media graphics
- Website banners
- Marketing materials

---

## ✅ Checklist de Assets

Antes de fazer deploy:

- [ ] Logo completo em: `public/assets/instagram/`
- [ ] Favicon (32x32) em: `public/assets/icons/`
- [ ] App icon (192x192) em: `public/assets/icons/`
- [ ] App icon (512x512) em: `public/assets/icons/`
- [ ] Maskable icons criados
- [ ] `manifest.json` configurado
- [ ] `index.html` aponta aos ícones corretos
- [ ] Testar no browser (DevTools > Application)
- [ ] Testar instalação PWA (Add to home screen)

---

## 🔗 Referências

- PWA Icons: https://web.dev/add-a-web-app-manifest/
- Favicon Generator: https://www.favicon-generator.org/
- Adaptive Icons: https://www.google.com/design/articles/androids-adaptive-icons/
- Instagram Specs: https://help.instagram.com/1631821640426723

---

## 📞 Dúvidas

Se tiveres dúvidas sobre qual ícone usar:

1. **Tab do browser** → Favicon (32x32)
2. **Home screen do telemóvel** → App icon (192x192 ou 512x512)
3. **Instagram/Social** → Logo completo (1080x1080)
4. **Splash screen** → App icon (512x512)

---

**Próximo passo: Extrair e guardar os ícones nos tamanhos corretos!**
