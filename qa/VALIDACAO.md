# Validação da entrega

- Build de produção: aprovado, com TypeScript verificado e rotas estáticas geradas.
- Auditoria das dependências de produção: nenhuma vulnerabilidade reportada.
- Navegador: 15 resoluções aprovadas, de 320 × 740 a 3840 × 2160.
- Inclui todas as resoluções exigidas: 375 × 812, 390 × 844, 430 × 932, 768 × 1024, 1366 × 768, 1440 × 900, 1920 × 1080, 2560 × 1440 e 3440 × 1440.
- Sem overflow horizontal nos casos testados.
- 22 verificações funcionais aprovadas: cenas, enquadramento do texto, rolagem reversa, menu, foco, Escape, destinos de conversão, imagens, schema, redução de movimento e WebKit.
- Nenhum erro de console, de página ou resposta HTTP de erro no teste final.
- Chromium e WebKit aprovados. Firefox não pôde ser iniciado pelo ambiente Windows; essa limitação está registrada em `report.json`.
- Fallback sem JavaScript aprovado.
- A sequência contínua foi verificada em sete tamanhos: 320×740, 390×844, 390×650, 768×1024, 1366×768, 1440×900 e 3440×1440. Os testes cobrem deslocamentos de apenas 1 px, reversão da imagem e posição, pausa sem autoplay, ausência de textos sobrepostos e fallback para redução de movimento.
- O ciclo 650 → 600 → 650 px de altura restaura o canvas preenchido depois do fallback estático.
- Recarregar a página no final do preparo preserva a posição da rolagem, a imagem, o texto e o indicador da cena 6. O teste confirmou tempo restaurado de 6,700179, sem erros de navegador.
- O topo do pão e o cheddar foram refeitos com alpha real para corrigir perspectiva e contato. O carregador seleciona uma variante desktop ou mobile por elemento.
- As medições locais não substituem testes em aparelhos físicos, rede móvel ou Lighthouse. Não há garantia universal de 60 FPS.

Relatórios atuais: `report.json` e `film/report.json`. Capturas: `screenshots/` e `film/`. `performance.json` preserva uma medição anterior à reconstrução do filme; seus números não representam esta revisão.

O vídeo de referência enviado posteriormente foi analisado. Trata-se de uma gravação de um celular sendo rolado; o contato visual está em `reference/contact.png`. O movimento foi reconstruído com recortes fotográficos em um único cenário. Não equivale à filmagem original nem a uma reprodução exata de seus quadros.
