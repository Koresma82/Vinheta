# 🎨 COMO EXTRAIR OS ÍCONES - GUIA VISUAL

Aqui está exatamente como separar cada ícone da imagem que recebeste.

---

## 📋 Resumo Executivo

A imagem `vinheta-icons.png` contém **4 variantes**:

```
┌─────────────────────────────────────────┐
│  FAV ICON (V)    │    APP ICON (Taça)   │
│  32x32           │    192x192 / 512x512 │
├─────────────────────────────────────────┤
│  FAV ICON (V)    │    APP ICON (Taça)   │
│  (Sem bg)        │    com "vinheta"     │
└─────────────────────────────────────────┘
```

**Precisa de criar 6 ficheiros:**
1. `vinheta-favicon.png` (32x32) - apenas o V
2. `vinheta-icon-192.png` (192x192) - taça sem label
3. `vinheta-icon-512.png` (512x512) - taça sem label
4. `vinheta-icon-maskable-192.png` (192x192) - taça sem label
5. `vinheta-icon-maskable-512.png` (512x512) - taça sem label
6. `vinheta-logo-completo.png` (1080x1080) - para Instagram (já tens!)

---

## 🛠️ MÉTODO 1: Usar Photoshop / GIMP (Melhor)

### Se tiveres Photoshop:

**Passo 1: Abrir a imagem**
```
File → Open → vinheta-icons.png
```

**Passo 2: Para extrair o FAV ICON (V)**
```
1. Seleciona a ferramenta Rectangle Select
2. Faz um retângulo à volta do "V" (canto superior esquerdo)
3. Image → Crop to Selection
4. Image → Scale Image → 32 pixels de largura
5. File → Export As → vinheta-favicon.png
```

**Passo 3: Para extrair o APP ICON (Taça)**
```
1. File → Open → vinheta-icons.png (abre de novo)
2. Rectangle Select à volta da taça (canto superior direito)
3. Image → Crop to Selection
4. Image → Scale Image → 192 pixels de largura
5. File → Export As → vinheta-icon-192.png

# Repete para 512x512 também
```

---

## 🛠️ MÉTODO 2: Usar GIMP (Grátis)

GIMP é grátis e funciona no Windows/Mac/Linux.

**Download**: https://www.gimp.org/download/

### Tutorial passo a passo:

**1. Abrir GIMP**
```
Abre GIMP
File → Open → vinheta-icons.png
```

**2. Extrair FAV ICON**
```
Tools → Selection Tools → Rectangle Select
Desenha um retângulo à volta do "V"
Image → Crop to Image
Image → Scale Image → 32x32
File → Export As → vinheta-favicon.png
```

**3. Extrair APP ICON (192px)**
```
File → Open → vinheta-icons.png
Rectangle Select à volta da taça completa
Image → Crop to Image
Image → Scale Image → 192x192
File → Export As → vinheta-icon-192.png
```

**4. Extrair APP ICON (512px)**
```
File → Open → vinheta-icons.png
Mesmo processo de crop
Image → Scale Image → 512x512
File → Export As → vinheta-icon-512.png
```

---

## 🛠️ MÉTODO 3: Online (Mais Fácil!)

### Usar Photopea (Online Photoshop)

**Link**: https://photopea.com

**Passo 1: Abrir**
```
Abre a página
File → Open → Escolhe vinheta-icons.png
```

**Passo 2: Crop FAV ICON**
```
Tools → Crop Tool (C)
Seleciona apenas o "V" (canto esquerdo)
Clica em Image
```

**Passo 3: Redimensionar para 32x32**
```
Image → Image Size
Width: 32 pixels
Height: 32 pixels
OK
```

**Passo 4: Exportar**
```
File → Export As
Name: vinheta-favicon.png
Format: PNG
Download
```

**Passo 5: Repetir para outros ícones**
```
File → Open → vinheta-icons.png (de novo)
# Crop à taça
# Redimensiona para 192x192
# Exporta como vinheta-icon-192.png

# Repete para 512x512
```

---

## 🎯 MÉTODO 4: Favicon Generator (Automático!)

### Usar Favicon Generator Online

**Link**: https://www.favicon-generator.org/

**Passo 1: Upload**
```
Click "Choose file"
Seleciona vinheta-icons.png
```

**Passo 2: Crop (se necessário)**
```
Vê a preview
Se precisar crop, adjust área
```

**Passo 3: Generate**
```
Clica "Generate favicon"
Vai gerar vários tamanhos automaticamente
```

**Passo 4: Download**
```
Clica "Download .ico package"
Extrai o ZIP
Copia o favicon.png para vinheta-favicon.png
```

---

## 📱 MÉTODO 5: Usar VS Code + Extensão

### Se tiveres VS Code:

**Instala extensão:**
```
Extensions → Procura "Image Tools"
Instala a extensão
```

**Usa para crop/resize:**
```
Abre a imagem no VS Code
Right-click → "Crop/Resize Image"
Define o tamanho
```

---

## ✅ CHECKLIST: Ficheiros Finais

Depois de extrair, terás na pasta `public/assets/icons/`:

```
✅ vinheta-favicon.png           32x32    (apenas V)
✅ vinheta-icon-192.png          192x192  (taça)
✅ vinheta-icon-512.png          512x512  (taça)
✅ vinheta-icon-maskable-192.png 192x192  (taça - adaptive)
✅ vinheta-icon-maskable-512.png 512x512  (taça - adaptive)
```

E na pasta `public/assets/instagram/`:

```
✅ vinheta-logo-completo.png     1080x1080 (completo com tagline)
```

---

## 🧪 Testar Depois de Extrair

Depois de ter os ícones nos ficheiros corretos:

### 1. Colocar nos locais certos

```bash
# Copiar para o projeto
cp vinheta-favicon.png vinheta-project/public/assets/icons/
cp vinheta-icon-192.png vinheta-project/public/assets/icons/
cp vinheta-icon-512.png vinheta-project/public/assets/icons/
# ... idem para os outros
```

### 2. Testar no browser

```bash
npm run dev
```

Abre http://localhost:3000

Verifica DevTools (F12):
```
Application → Manifest
Verifica se os icons aparecem com as imagens corretas
```

### 3. Testar PWA

No browser (Chrome/Edge):
```
1. Abre a app
2. Clica no ícone de "instalar" (barra de endereço)
3. Clica "Instalar"
4. Verifica se o ícone aparece no home screen
```

---

## 💡 Dica: Criar Direto com Código

Se souberes programar, podes usar ImageMagick:

```bash
# Extrair favicon
convert vinheta-icons.png -crop 25%+0+0 +repage -resize 32x32 vinheta-favicon.png

# Extrair app icon (192)
convert vinheta-icons.png -crop 50%+50%+0 +repage -resize 192x192 vinheta-icon-192.png

# Extrair app icon (512)
convert vinheta-icons.png -crop 50%+50%+0 +repage -resize 512x512 vinheta-icon-512.png
```

---

## 🎯 TL;DR (Versão Curta)

1. **Favicon (32x32)**: Crop apenas o "V"
2. **App icon (192x192)**: Crop a taça completa
3. **App icon (512x512)**: Mesma taça, mas 512px
4. **Maskable (idem)**: Sem background branco, se possível
5. **Logo completo (1080x1080)**: Usar a primeira imagem

---

## 📞 Se Ficares Preso

1. Tenta **MÉTODO 3** (Photopea online) - é o mais fácil!
2. Se não conseguires, pede ajuda - tenho ferramentas para converter

---

**Próximo passo: Extrair os ícones e guardar em `public/assets/icons/`! 🚀**
