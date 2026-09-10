> Status: implementado. Este documento é o brief original do projeto, mantido
> como registro histórico da especificação. O pipeline (extração do grid,
> solver de rota, temas, Action) começou como base do projeto Platane/snk, mas
> o projeto em si — nome, pacotes, Action, README — é o "space-invaders-contributions",
> não um fork.

Objetivo: substituir a animação da "cobra" por uma animação de Space Invaders,
mantendo intacto todo o resto do pipeline (extração do grid de contribuições,
sistema de temas light/dark via CSS vars --c0 a --c4, GitHub Action, output
para SVG).

O que muda:

- Remove a lógica de movimento/"comer" da cobra
- Adiciona uma nave (sprite customizado, fornecido à parte) que se move no eixo X
  numa linha abaixo do grid de contribuições (equivalente à área onde hoje ficam
  os segmentos .u da cobra, y=144 no viewBox atual)
- Cada célula de contribuição (.c) com contagem > 0 vira um "invader"
- A nave atira (elemento de laser animado via CSS, sem JS) em direção a cada
  invader; ao ser atingido, a célula perde a cor (transição pra --ce, igual o
  fade que a cobra já faz ao comer)
- Ordem de destruição: usar a mesma lógica de ordenação cronológica do snake por
  enquanto (mais simples), deixar preparado pra trocar por estratégia
  configurável depois (linha, coluna, aleatório)

Restrições técnicas (herdadas do snk, não mudar):

- Animação 100% CSS via @keyframes, sem JS no SVG final (README-safe)
- Precisa gerar variante light e dark
- Loop contínuo e determinístico (calcula tudo antes, não é interativo)

Assets que vou fornecer: sprite da nave e do tiro (SVG ou path), vocês adaptam
pro sistema de cores existente (usar var(--cs) como já é feito hoje pro corpo
da cobra).

---

Assets (vetorizados a partir dos PNGs fornecidos, cor sólida sem gradiente/sombra):

assets/nave.svg
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
<path fill="var(--cs)" d="M236,0 L231,105 L194,111 L194,317 L175,317 L171,212 L123,217 L123,352 L91,354 L86,388 L69,387 L68,286 L21,283 L17,436 L86,441 L93,476 L157,476 L163,511 L208,510 L212,476 L229,477 L234,511 L279,510 L283,476 L300,477 L303,510 L348,511 L354,476 L418,476 L425,441 L493,438 L494,287 L443,286 L442,387 L425,388 L420,354 L388,352 L388,217 L340,212 L336,317 L317,317 L317,111 L283,105 L283,4 Z"/>
</svg>

assets/bala.svg
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
<rect fill="var(--cs)" x="100" y="100" width="312" height="312" rx="48" ry="48"/>
</svg>

Nota: os .png originais eram raster de cor sólida (sem gradiente/sombra), então
foram vetorizados (contorno extraído + fill trocado por var(--cs), a mesma
variável que o corpo do snake já usa). Isso é necessário porque o resto do
pipeline é 100% CSS-var-themed para funcionar em light/dark - um PNG hardcoded
quebraria isso e adicionaria peso desnecessário ao SVG final. Os PNGs
originais podem ficar como referência visual, mas o que entra no build é o
path/rect acima.

Localização dos assets: assets/nave.svg e assets/bala.svg - livre pra mover se
fizer mais sentido em outra estrutura de pastas do projeto.
