# Imobi SaaS — Passo a passo até PRODUÇÃO na Google Play

> App: **Imobi SaaS - Gestão Imobiliária** · Package `br.com.imobisaas.app`
> Domínio: www.gestaodeimoveis.app.br · Conta dev: AgenciAR Digital
> Objetivo: 1ª versão direto em Produção (pular teste interno/aberto).

## Pré-requisitos (neste repo)
- `imobisaas-1.0.0-vc1.aab` — bundle assinado
- `assets/icon-512.png` · `assets/feature-graphic.png` · `screenshots/`
- Keystore: `C:/Users/cspga/.android/imobiliaria-upload-keystore.jks` (alias upload)
- **Senha:** `Imobiliaria@2026!Upload`
- Upload key SHA-256: `B2:13:96:54:25:EC:D0:9B:1F:97:6C:B0:96:56:2F:0A:9C:81:E0:E4:6C:B8:29:BC:E4:B0:65:3F:99:7C:6B:6E`
- assetlinks live + API funcional (health 200) ✅

## ⚠️ Backend (já corrigido por este agente)
Mesma arquitetura híbrida do NutriFoco: Firebase Auth + dados MySQL.
- Tabelas com prefixo `imob_` no banco compartilhado Hostinger (NUNCA rodar `prisma db push`).
- `DATABASE_URL` configurada na Vercel; `api/index.ts` → `server.ts` (app exportado); prisma generate no build.

## Passo a passo
1. Play Console → Create app → `Imobi SaaS - Gestão Imobiliária` · pt-BR · App · Gratuito
2. App content: ver `declaracoes.md` (login Google; sem anúncios; Data safety com dados de conta/imóveis)
3. Política de privacidade: criar página /privacidade (pendente)
4. Ficha: `ficha-loja.md` + assets
5. Production → Create release → Play App Signing → upload AAB → rollout → enviar revisão
6. Pós: adicionar SHA-256 da App signing key ao assetlinks.json
