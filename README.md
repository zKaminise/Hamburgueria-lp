# BRASA — Smash Burger

Site demonstrativo completo de uma hamburgueria artesanal, com fotografia gastronômica própria, seis cenas controladas pelo scroll, cardápio e pedidos pelo WhatsApp.

## Abrir o projeto

Requer Node.js 22 ou superior e npm.

```powershell
cd 'D:\Importante\Codex\LP Hamburguer'
npm install
npm run dev
```

Abra http://127.0.0.1:3000. Também é possível executar `iniciar-site.cmd` nesta pasta.

Para executar a versão de produção:

```powershell
npm run build
npm start
```

## Personalizar para o cliente

O arquivo `src/config/site.ts` reúne nome, subtítulo, slogan, descrição, cores, telefone, URL de pedidos, WhatsApp, Instagram, endereço, horários, coordenadas, imagem social, produtos e preços.

- **Trocar o destino dos pedidos:** altere somente `orderUrl`. Todos os botões de conversão, inclusive o flutuante, usam esse campo através do componente `OrderButton` ou da mesma configuração.
- **Alterar o WhatsApp:** edite `whatsappNumber` e `phone` no mesmo arquivo.
- **Editar o cardápio:** altere a lista `burgers`. Os preços são formatados automaticamente em reais.
- **Marca:** `brandName` e `brandSubtitle`. Nenhuma fotografia contém a marca incorporada.
- **Instagram, endereço e horários:** campos vazios são omitidos; o site oferece consulta pelo WhatsApp. Não há endereço, horário ou perfil fictício.
- **Domínio e SEO:** copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SITE_URL`. Isso habilita canonical, URLs absolutas de compartilhamento e sitemap. O schema Restaurant já está implementado e inclui os campos de negócio à medida que forem preenchidos.
- **Antes de publicar:** confirme produtos e preços, preencha dados reais e mude `demo` para `false`. Enquanto demonstrativo, o site informa que os preços devem ser confirmados e desabilita indexação.

## Experiência e arquitetura

Next.js App Router, React, TypeScript, CSS responsivo e GSAP/ScrollTrigger. As fontes Barlow Condensed, DM Sans e Space Mono são gratuitas e servidas localmente. Não há dependência de Google Fonts em tempo de execução, hotlinks de fotografias, WebGL ou vídeos pesados.

A abertura mostra o burger pronto. Ao rolar, a área permanece fixada e a narrativa passa por carne, pressão, crosta, cheddar, montagem e burger final. O movimento é reversível e cada cena pode ser acessada pelos controles inferiores. Há atalho direto para o cardápio.

O preparo usa **um único cenário em canvas, com elementos fotográficos transparentes**, dirigido pelo scroll. A carne cai, a prensa comprime, a crosta aparece, o queijo adere à carne, o pão inferior entra pela lateral e o topo fecha a montagem. As posições são contínuas, sem arredondamento para quadros fixos; até deslocamentos de 1 px alteram o movimento. Avançar ou voltar retorna à posição correspondente, sem reprodução automática. Há suavização de 0,4 s para absorver os saltos da roda do mouse. Dentro do preparo, apenas os textos mudam de cena, sem sobreposição entre legendas. `src/lib/burger-film.ts` concentra posições e tempos; `BurgerFilm.tsx` desenha diretamente no ciclo de animação do GSAP.

É uma animação de recortes fotográficos, não uma filmagem real do preparo. Falha ao carregar o canvas ou os assets preserva as fotografias de fallback. As imagens possuem variantes desktop e mobile e o canvas limita a resolução de renderização em telas muito grandes.

Com `prefers-reduced-motion`, as cenas ficam estáticas e sequenciais. Em telas de altura inferior a 620 px, a mesma composição estática evita prender conteúdo fora da tela. Sem JavaScript, um fallback mantém todas as cenas e links disponíveis.

## Estrutura

```text
src/app/            Página, layout, CSS, metadata, robots e sitemap
src/components/     Header, experiência, cardápio, conceito, CTAs e footer
src/config/         Personalização da marca e roteiro das cenas
public/assets/      Fotografias WebP desktop/mobile
docs/               Prompts originais das imagens
scripts/            Preparação de assets e verificações de navegador
qa/                 Relatório de testes e capturas locais
```

## Verificação

```powershell
npm run typecheck
npm run build
npm run test:browser
npm run test:film
```

O teste de navegador requer Chrome instalado. Ele verifica 15 resoluções, scroll fixado, navegação de cenas, retorno do scroll, enquadramento do texto, menu móvel, Escape/foco, links de conversão, imagens, schema e redução de movimento. Gera `qa/report.json` e screenshots em `qa/screenshots/`. WebKit e Firefox são verificados quando seus executáveis Playwright estão disponíveis; indisponibilidade do ambiente é registrada separadamente.

Para testar outro servidor, configure `TEST_URL`. O script `scripts/prepare-assets.mjs` pode converter novamente os originais para WebP; os prompts completos, gerados pela ferramenta nativa de imagens, estão em `docs/image-prompts.json`.

O teste `test:film` verifica deslocamentos de 1 px, retorno da animação, pausa, sete tamanhos de tela, textos sem sobreposição e redução de movimento. Também testa a passagem 650 → 600 → 650 px de altura para verificar a recuperação do canvas. Gera `qa/film/report.json` e capturas. Os recortes originais são preparados por `scripts/prepare-film-assets.mjs`, com prompts em `docs/film-image-prompts.json`. A revisão da perspectiva do pão e do cheddar usa `scripts/prepare-film-v2-assets.mjs` e `docs/film-v2-prompts.json`.

## Referência

O vídeo `WhatsApp Video 2026-09-22 at 17.11.05.mp4` foi analisado na revisão do scroll. Ele registra um celular sendo rolado, com mão e interface no enquadramento; por isso, foi usado como referência de movimento, sem incorporá-lo ao site. A animação reconstrói o preparo com os elementos da BRASA. Para reproduzir exatamente o movimento físico da referência, seria necessário o vídeo limpo ou a sequência original de quadros. O projeto está preparado para demonstração local; nenhum domínio ou serviço de pedidos externo foi criado.
