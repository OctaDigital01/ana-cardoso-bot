# 🎨 Design System - Liquid Glass

## Visão Geral

O design system do TelegramBot Manager é inspirado no conceito "Liquid Glass" da Apple, combinando elementos de glassmorphism com uma paleta de cores escura e moderna. O sistema prioriza legibilidade, acessibilidade e uma experiência visual premium.

## 🎯 Princípios de Design

### 1. Clareza
- Hierarquia visual clara
- Tipografia legível
- Contrastes adequados
- Informações organizadas

### 2. Consistência
- Padrões visuais consistentes
- Comportamentos previsíveis
- Espaçamentos uniformes
- Estados bem definidos

### 3. Elegância
- Elementos refinados
- Transições suaves
- Detalhes cuidadosos
- Minimalismo funcional

## 🌈 Paleta de Cores

### Cores Primárias

```css
:root {
  /* Backgrounds */
  --bg-primary: #000000;
  --bg-secondary: #0A0A0A;
  --bg-tertiary: #141414;
  --bg-quaternary: #1A1A1A;
  
  /* Glass Effects */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-bg-hover: rgba(255, 255, 255, 0.08);
  --glass-bg-active: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-border-hover: rgba(255, 255, 255, 0.15);
  
  /* Accent Colors */
  --accent-primary: #007AFF;
  --accent-primary-hover: #0056CC;
  --accent-primary-active: #003D99;
  
  --accent-secondary: #5E5CE6;
  --accent-secondary-hover: #4B49E6;
  --accent-secondary-active: #3837E6;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-tertiary: rgba(255, 255, 255, 0.6);
  --text-quaternary: rgba(255, 255, 255, 0.4);
  
  /* Status Colors */
  --success: #30D158;
  --success-bg: rgba(48, 209, 88, 0.1);
  
  --warning: #FF9F0A;
  --warning-bg: rgba(255, 159, 10, 0.1);
  
  --error: #FF3B30;
  --error-bg: rgba(255, 59, 48, 0.1);
  
  --info: #64D2FF;
  --info-bg: rgba(100, 210, 255, 0.1);
}
```

### Cores de Gradientes

```css
:root {
  /* Primary Gradients */
  --gradient-primary: linear-gradient(135deg, #007AFF 0%, #5E5CE6 100%);
  --gradient-secondary: linear-gradient(135deg, #5E5CE6 0%, #AF52DE 100%);
  
  /* Glass Gradients */
  --gradient-glass: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
    
  --gradient-glass-hover: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.08) 100%);
    
  /* Shimmer Effect */
  --gradient-shimmer: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%);
}
```

## 📝 Tipografia

### Font Stack

```css
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                  'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
  
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 
               Consolas, 'Courier New', monospace;
}
```

### Scales de Tipografia

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Font Weights */
  --weight-light: 300;
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;
}
```

### Hierarquia Tipográfica

```css
.heading-1 {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.heading-2 {
  font-size: var(--text-3xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
}

.heading-3 {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

.body-large {
  font-size: var(--text-lg);
  font-weight: var(--weight-normal);
  line-height: var(--leading-relaxed);
}

.body {
  font-size: var(--text-base);
  font-weight: var(--weight-normal);
  line-height: var(--leading-normal);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: var(--weight-normal);
  line-height: var(--leading-normal);
}

.caption {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  line-height: var(--leading-normal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## 📏 Espaçamento

### Escala de Espaçamento

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Aplicação de Espaçamento

```css
/* Containers */
.container {
  padding: var(--space-6);
  margin: 0 auto;
}

/* Cards */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

/* Form Elements */
.form-group {
  margin-bottom: var(--space-4);
}

.form-input {
  padding: var(--space-3) var(--space-4);
}
```

## 🎭 Glassmorphism Effects

### Base Glass

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.glass:active {
  background: var(--glass-bg-active);
  transform: translateY(0);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Glass Variations

```css
/* Strong Glass */
.glass-strong {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Subtle Glass */
.glass-subtle {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Frosted Glass */
.glass-frosted {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(60px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

## 🧩 Componentes Base

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-primary);
  border: none;
  border-radius: 12px;
  padding: var(--space-3) var(--space-6);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
}

/* Glass Button */
.btn-glass {
  background: var(--glass-bg);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--space-3) var(--space-6);
  backdrop-filter: blur(20px);
  transition: all 0.2s ease;
}

.btn-glass:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-1px);
}

/* Icon Button */
.btn-icon {
  width: 44px;
  height: 44px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  transition: all 0.2s ease;
}
```

### Cards

```css
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: var(--space-6);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--glass-border-hover);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Form Elements

```css
.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--space-4);
  color: var(--text-primary);
  font-size: var(--text-base);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: var(--text-tertiary);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 
    0 0 0 4px rgba(0, 122, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.form-label {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-2);
  display: block;
}
```

## 🎯 Estados Interativos

### Hover States

```css
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.interactive-subtle:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}
```

### Focus States

```css
.focusable:focus {
  outline: none;
  box-shadow: 
    0 0 0 4px rgba(0, 122, 255, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Loading States

```css
.loading {
  position: relative;
  overflow: hidden;
}

.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--gradient-shimmer);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

## 🔄 Animações e Transições

### Transições Base

```css
:root {
  --transition-fast: 0.1s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-slower: 0.5s ease;
}

.transition-all {
  transition: all var(--transition-base);
}

.transition-transform {
  transition: transform var(--transition-base);
}

.transition-colors {
  transition: background-color var(--transition-base), 
              border-color var(--transition-base),
              color var(--transition-base);
}
```

### Animações Personalizadas

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.3s ease forwards;
}

/* Slide In */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.4s ease forwards;
}
```

## 📱 Responsividade

### Breakpoints

```css
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}

/* Mobile First */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

### Responsive Utilities

```css
/* Hide/Show */
.hidden-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hidden-mobile {
    display: block;
  }
  
  .hidden-desktop {
    display: none;
  }
}

/* Responsive Text */
.text-responsive {
  font-size: var(--text-sm);
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: var(--text-base);
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: var(--text-lg);
  }
}
```

## ♿ Acessibilidade

### Contrastes

```css
/* Garantir contraste mínimo WCAG AA */
.text-contrast-high {
  color: var(--text-primary); /* Contraste 21:1 */
}

.text-contrast-medium {
  color: var(--text-secondary); /* Contraste 7:1 */
}

.text-contrast-low {
  color: var(--text-tertiary); /* Contraste 4.5:1 */
}
```

### Focus Indicators

```css
.focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Para usuários que navegam por teclado */
@media (prefers-reduced-motion: no-preference) {
  .focus-visible {
    transition: outline-color 0.2s ease;
  }
}
```

### Motion Preferences

```css
/* Respeitar preferência de movimento reduzido */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎨 Implementação com Tailwind CSS

### Configuração Personalizada

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          'bg-hover': 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.15)',
        },
        accent: {
          primary: '#007AFF',
          secondary: '#5E5CE6',
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'shimmer': 'shimmer 2s infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
```

## 🧪 Testing do Design System

### Visual Regression Testing

```typescript
// tests/visual.test.ts
import { test, expect } from '@playwright/test'

test('Button variants should match design', async ({ page }) => {
  await page.goto('/design-system/buttons')
  
  await expect(page.locator('.btn-primary')).toHaveScreenshot('button-primary.png')
  await expect(page.locator('.btn-glass')).toHaveScreenshot('button-glass.png')
})
```

### Accessibility Testing

```typescript
// tests/a11y.test.ts
import { injectAxe, checkA11y } from 'axe-playwright'

test('Design system should be accessible', async ({ page }) => {
  await page.goto('/design-system')
  await injectAxe(page)
  await checkA11y(page)
})
```

## 📖 Documentação com Storybook

```typescript
// stories/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../components/Button'

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
}

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Button',
  },
}
```

## 📚 Recursos

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Glassmorphism CSS Generator](https://glassmorphism.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Motion Design Principles](https://material.io/design/motion/)