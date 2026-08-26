# VIREO ARK — wordmark

Extraído do arquivo oficial `VIREO LOGOS- CARDIOLINE.ai` (página 19, seção
"Data Management Software"), em `cardioline-drive/05-marca-e-materiais/2025-10-08-vireo-marca-e-rotulagem-abpm/`.
Vetor de verdade — recortado do PDF com `pdftocairo -svg`, sem o fundo preto e
sem os arcos decorativos da página. Proporção **390 × 67** (≈ 5.82 : 1).

| Arquivo | Quando | Cores |
| --- | --- | --- |
| `vireo-ark.svg` | Fundos claros (tema light) | VIREO `#E95B0C` · ARK `#878787` |
| `vireo-ark-white.svg` | Navy, preto e o painel de marca do login | VIREO `#E95B0C` · ARK `#FFFFFF` |

As duas combinações são as aprovadas na página 42 do
`VIREO BrandGuideline - CARDIOLINE.pdf` ("Logo color combinations"). O guideline
proíbe recolorir para fora das combinações da grade, esticar, girar, contornar ou
mudar o arranjo do logo — se precisar de outro fundo, tirar a variante de lá em
vez de inventar.

**Atenção:** o laranja VIREO (`#E95B0C`) **não** é o laranja do tema do app
(`#EE5B00`, o `--primary` do Beat) nem o do wordmark Cardioline (`#F66201`).
São três laranjas diferentes e o logo carrega o seu.

## Favicon

`src/app/icon.svg` é gerado a partir do **V** deste wordmark — o primeiro path
laranja de `vireo-ark.svg` — recortado pela bounding box (x 227–277, y 274.9–320.6)
e centralizado num tile navy `#071046` de 64×64, `rx 16`, ocupando 59% da largura.
A letra não é redesenhada nem alterada: é o glifo do arquivo oficial.

Se o wordmark for atualizado, o V precisa ser reextraído junto.
