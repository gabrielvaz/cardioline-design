# Vireo Arc

> Aplicativo de ECG e Eletrocardiograma da Cardioline

Plataforma web para leitura, interpretação e gestão de exames cardíacos. Parte do monorepo **Cardioline Design**.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Design System**: `@cardioline/ui` — ShadCN customizado
- **Styling**: Tailwind CSS v3
- **Language**: TypeScript 5

## Desenvolvimento Local

```bash
# Na raiz do monorepo
npm install
npm run dev

# Ou diretamente nesta pasta
npm run dev    # http://localhost:3001
```

## Estrutura

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Página de login
│   ├── (dashboard)/
│   │   └── dashboard/      # Dashboard principal
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Redirect → /login
├── components/
│   ├── auth/
│   │   └── login-form.tsx   # Formulário de login
│   └── ui/
│       └── ecg-background.tsx  # Animação ECG de fundo
```

## Identidade Visual

- **Primário**: Navy Blue `#1840a2`
- **Acento ECG**: Red `#f83b3b`
- **Background Dark**: `#0b1529`
- **Tipografia**: DM Sans (headings) + Inter (body)
