# Assets da BRASA

Todas as imagens usadas são locais e foram geradas para este projeto com a ferramenta nativa `image_gen`. São demonstrações publicitárias, não fotografias de um produto real do cliente. Não há imagens com a marca embutida ou hotlinks externos. Os prompts completos estão em `docs/image-prompts.json`.

## Arquivos entregues

| Caminho em `public/assets/` | Conteúdo                                                  | Uso                            |
| --------------------------- | --------------------------------------------------------- | ------------------------------ |
| `burger/hero.webp`          | Brioche, dois discos de carne, cheddar, picles e vegetais | Abertura, Classic e cena final |
| `burger/double.webp`        | Dois discos, cheddar, bacon e cebola caramelizada         | Double Fire e CTA final        |
| `burger/bacon.webp`         | Carne, cheddar, bacon e maionese                          | Bacon Melt                     |
| `sequence/beef.webp`        | Bola de carne fresca                                      | Cena 01                        |
| `sequence/smash.webp`       | Prensa de aço sobre carne na chapa                        | Cena 02                        |
| `sequence/sear.webp`        | Macro da crosta                                           | Cena 03 e editorial            |
| `sequence/melt.webp`        | Cheddar derretido na carne                                | Cena 04                        |
| `sequence/cheddar.webp`     | Fatia isolada com transparência                           | Queda do cheddar               |
| `sequence/assembly.webp`    | Três grupos de ingredientes separados                     | Montagem em camadas            |

Cada arquivo tem uma versão `-mobile.webp` de 800 px de largura. As versões desktop têm 1536 × 1024 px. A proporção é 3:2. O canal alpha do cheddar é preservado.

## Substituição por fotos reais

Os arquivos entregues permitem apresentar o conceito sem substituições obrigatórias. Para representar um cliente real, substitua-os por imagens do produto efetivamente vendido e confirme pesos, receitas, preços e horários.

Mantenha fundo quase preto, luz quente lateral, crosta visível, vapor discreto e nenhuma marca incorporada. Preserve enquadramento, ângulo e escala entre carne, crosta e cheddar. A foto de montagem deve manter o pão superior nos 0–33% da altura, carne/queijo em 33–58% e pão inferior/vegetais em 58–100%, com espaços pretos entre os grupos. Se mudar essa distribuição, ajuste os recortes em `globals.css`.

## Preparo contínuo controlado pelo scroll

`public/assets/film/` contém o cenário `griddle` e seis elementos transparentes: `raw`, `patty`, `press`, `cheese`, `bun-top` e `bun-bottom`. As variantes mobile têm até 640 px (cenário: 900 px); as desktop têm até 1200 px (cenário: 1536 px). As proporções variam conforme o recorte. Os prompts estão em `docs/film-image-prompts.json` e as dimensões em `docs/film-assets.json`.

Na revisão visual, `bun-top-v2` substitui o topo anterior para ocultar a face inferior e corrigir a perspectiva. `patty-cheese-v2` mostra o cheddar aderido à mesma carne, substituindo a fatia solta ao terminar a queda. Ambos têm variantes mobile e alpha real; prompts em `docs/film-v2-prompts.json`, dimensões em `docs/film-v2-assets.json`.

Esses elementos são animados em um mesmo canvas, com posições contínuas determinadas pelo scroll, sem quantização. As fotografias em `sequence/` permanecem como fallback estático. A animação é uma composição fotográfica, não uma captura real de vídeo. O vídeo enviado foi analisado; como é uma filmagem da tela de um celular, não fornece quadros limpos para utilização direta.
