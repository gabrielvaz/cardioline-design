# @cardioline/ui

**Cardioline Design System** — componentes ShadCN/UI customizados com a identidade visual da Cardioline.

## Identidade Visual

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `hsl(220, 68%, 37%)` — Navy Blue `#1840a2` | CTAs, links, elementos de destaque |
| `--accent` | `hsl(0, 90%, 60%)` — ECG Red `#f83b3b` | Alertas, ondas ECG, ênfase |
| `--background` | `hsl(210, 40%, 98%)` — Off-white clínico | Background geral |
| `--foreground` | `hsl(222, 47%, 11%)` | Texto principal |

## Fontes

- **Headings**: DM Sans (600)
- **Body/UI**: Inter (400/500)
- **Mono/Data**: JetBrains Mono

## Componentes

```tsx
import { Button, Input, Label, Card } from '@cardioline/ui';
import { cn } from '@cardioline/ui';
import { cardiolineColors } from '@cardioline/ui';
```

## Variantes especiais

```tsx
// Botão da marca
<Button variant="cardioline">Entrar</Button>

// Botão de alerta cardíaco
<Button variant="cardiac">Emergência</Button>
```

## Uso

1. Importe o CSS global no seu app:
```tsx
import '@cardioline/ui/src/styles/globals.css';
```

2. Adicione o preset do Tailwind:
```ts
// tailwind.config.ts
import uiConfig from '@cardioline/ui/tailwind.config';
```
