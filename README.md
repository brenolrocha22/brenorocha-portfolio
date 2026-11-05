# Breno Rocha | Tech & Data

Portfólio de Breno Lins Rocha (Recife/PE): dados e IA generativa com Python.

> Transformando conhecimento, dados e tecnologia em soluções para problemas reais.

## O que tem aqui

- **Projetos em estudo de caso**: problema, solução, arquitetura, números com fonte e limitações.
- **Soluções, tecnologias e certificações**: cada afirmação aponta para a prova (repositório, demo ou link de validação).
- **Contato**: formulário com validação no servidor, honeypot, time trap e rate limit; envio via Resend, com fallback para e-mail.
- **Dados do GitHub**: última atualização e linguagens de cada projeto, revalidados a cada 24 h, com fallback se a API falhar.

## Stack

Next.js 16 (App Router, SSG/ISR) · React 19 · TypeScript · Tailwind CSS 4 · MDX (next-mdx-remote) · zod · Resend · Vercel.

Conteúdo em `content/` (MDX e JSON), validado com zod no build: conteúdo inválido quebra o build.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # todas as variáveis são opcionais em desenvolvimento
npm run dev
```

Scripts: `npm run lint`, `npm run build`, `npm start`.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canônica (sitemap, Open Graph, JSON-LD) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | Envio do formulário de contato |
| `GITHUB_TOKEN` | Opcional: aumenta o limite da API do GitHub |

Segredos nunca são versionados: use `.env.local` ou as variáveis da Vercel.

## Contato

[LinkedIn](https://www.linkedin.com/in/brenolrocha/) · [GitHub](https://github.com/brenolrocha22) · brenolrocha@gmail.com
