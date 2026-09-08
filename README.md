# 📦 ScrapFlow — Animação de Palete com Scroll (Scrollytelling)

Uma experiência interativa de **scrollytelling** de alta performance construída com **Next.js**, **Framer Motion**, **HTML5 Canvas** e **Tailwind CSS**. Conforme o usuário rola a página, uma sequência contínua de imagens é reproduzida em tempo real, mostrando blocos industriais de sucata compactada caindo e se empilhando perfeitamente sobre um palete de madeira.

---

## 🚀 Demonstração da Mecânica

O projeto utiliza um container com altura estendida de `400vh` e um elemento `<canvas>` com posicionamento `sticky`:

- **Pré-carregamento com Trava de Scroll**: Todos os 150 frames em formato WebP são carregados previamente na memória antes da rolagem ser liberada, evitando telas pretas ou piscadas (*flickering*).
- **Mapeamento de Scroll Progress (0 → 1)**: O progresso da rolagem é capturado via hook `useScroll` do Framer Motion e mapeado para o índice exato do frame (1 a 150).
- **Renderização em HTML5 Canvas**: Desenho a 60–120 FPS utilizando `requestAnimationFrame`, cancelando frames duplicados e oferecendo suporte a telas de alta densidade (Retina/HiDPI).
- **Seamless Blending**: O fundo do site `#FFFFFF` se funde de forma 100% imperceptível com o estúdio das imagens através de uma máscara radial suave.
- **Narrativa em Camadas de Texto**:
  - **0% de Scroll**: *"Transforming Metal Waste."* — O palete de madeira vazio é introduzido.
  - **30% de Scroll**: *"Precise Compaction."* — Primeiros blocos caem e se acomodam.
  - **60% de Scroll**: *"Stacking for Efficiency."* — O palete atinge metade da capacidade com precisão geométrica.
  - **90% de Scroll**: *"Ready for Transit."* — Palete 100% preenchido, amarrado e pronto para logística.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 16 (App Router)](https://nextjs.org/)** — Framework React com Turbopack e Server Components.
- **[React 19](https://react.dev/)** — Biblioteca base para a interface.
- **[Framer Motion](https://www.framer.com/motion/)** — Orquestração de animações baseadas no scroll (`useScroll`, `useTransform`, `useMotionValueEvent`).
- **[HTML5 Canvas API](https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API)** — Renderização gráfica acelerada por hardware para a sequência de quadros.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização moderna e responsiva.
- **[Lucide React](https://lucide.dev/)** — Conjunto de ícones minimalistas.
- **[Sharp](https://sharp.pixelplumbing.com/)** — Processamento e otimização dos frames em WebP de altíssima eficiência (~24 KB por quadro).

---

## 📁 Estrutura do Projeto

```text
scroll-animate/
├── app/
│   ├── globals.css              # Reset, pure light mode e custom scrollbars
│   ├── layout.tsx               # Metadados e fontes (Geist)
│   └── page.tsx                 # Landing page com navbar, sequência e seções
├── components/
│   └── PalletStackSequence.tsx  # Componente principal do canvas e scrollytelling
├── public/
│   └── frames/                  # 150 frames otimizados (scrap_pallet_[1..150].webp)
├── images-animated/             # Sequência original de imagens
└── package.json
```

---

## 💻 Como Rodar o Projeto Localmente

### 1. Clonar o repositório e instalar as dependências:
```bash
git clone <url-do-repositorio>
cd scroll-animate
npm install
```

### 2. Iniciar o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para interagir com a animação.

---

## 📦 Build para Produção

Para gerar a versão otimizada de produção e testar a performance máxima:

```bash
npm run build
npm run start
```

---

## ⚙️ Principais Decisões Técnicas

1. **Por que HTML5 Canvas em vez de tags `<img>` normais?**
   Trocar o `src` de uma tag `<img>` centenas de vezes durante a rolagem causa engasgos na thread principal e recálculo frequente de layout. O Canvas 2D desenha buffers de bitmap na GPU instantaneamente sem nenhum recálculo de DOM.

2. **Aspect Ratio "Contain" no Canvas:**
   O canvas recalcula dinamicamente a proporção `16:9` da imagem em relação à largura e altura da janela (`window.innerWidth` e `window.innerHeight`), garantindo que o palete nunca seja cortado em telas de smartphones (portrait) ou monitores ultrawide.

3. **Preloader e Bloqueio de Scroll:**
   A classe `loading-locked` (`overflow: hidden; touch-action: none`) impede a rolagem do usuário até que todas as 150 imagens estejam carregadas na memória cache do navegador, garantindo uma experiência contínua e sem piscadas.

