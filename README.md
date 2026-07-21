# Cardioline Design Monorepo

Monorepo oficial da Cardioline para o Design System e aplicações de cardiologia diagnóstica.

## Estrutura

```
cardioline-design/
├── packages/
│   └── ui/                     # Design System Cardioline (ShadCN customizado)
├── apps/
│   └── vireo-arc/              # App de ECG/Eletrocardiograma
└── turbo.json
```

## Packages

### `@cardioline/ui`
Design System oficial da Cardioline construído sobre ShadCN/UI, com tokens de cores e componentes customizados conforme a identidade visual da marca.

## Apps

### Vireo Arc
Aplicativo de ECG e eletrocardiograma da Cardioline. Interface moderna para leitura, interpretação e gestão de exames cardíacos.

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar todos os apps em dev
npm run dev

# Rodar app específico
cd apps/vireo-arc && npm run dev

# Build geral
npm run build
```

## Stack

- **Monorepo**: Turborepo + npm workspaces
- **Framework**: Next.js 15 (App Router)
- **Design System**: ShadCN/UI customizado para a Cardioline
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
