# Trabalho P2 — Heaps e Filas de Prioridade (Tema C)

> 🎥 **Vídeo explicativo:** https://youtu.be/7zQV4wpXFEg

**Nome completo:** José Armando da Mata Tiezzi   
**Tema escolhido:** C — Heaps e Filas de Prioridade (Min-Heap / Max-Heap)

## Como executar
- Python: `python src/algoritmo.py`
- Simulador: abra `src/demo/index.html` no navegador (sem servidor).

## Resumo teórico
Heap binário é uma árvore binária completa guardada em um array. No min-heap, todo pai é menor ou igual aos filhos (no max-heap, maior ou igual), então a raiz é sempre o menor (ou maior) elemento. Índices: `pai = (i-1)//2`, `esq = 2i+1`, `dir = 2i+2`.
- **insert:** coloca no fim e faz *sift-up* (troca com o pai enquanto tiver prioridade).
- **extract:** remove a raiz, move o último elemento para a raiz e faz *sift-down* (troca com o filho de maior prioridade).
- **peek:** lê a raiz.

Usos reais: filas de prioridade, escalonador de processos, Dijkstra, Heap Sort, k maiores elementos, simulação de eventos.

## Complexidade

| Operação | Melhor caso | Caso médio | Pior caso | Espaço auxiliar |
|---|---|---|---|---|
| peek | O(1) | O(1) | O(1) | O(1) |
| insert | O(1) | O(1) | O(log n) | O(1) |
| extract | O(1) | O(log n) | O(log n) | O(1) |

O espaço auxiliar é O(1) porque o sift-up e o sift-down são iterativos e só usam algumas variáveis. O array do heap ocupa O(n) no total. A altura de uma árvore binária completa com n nós é ⌊log₂ n⌋, e é ela que limita o custo de subir ou descer.

### insert
- **Melhor caso, O(1):** o novo valor já respeita a propriedade em relação ao pai (por exemplo, inserir um valor grande em um min-heap). Há 1 comparação e nenhuma troca.
- **Caso médio, O(1):** com valores aleatórios, cerca de metade dos nós está nas folhas, então o novo elemento quase sempre sobe poucos níveis. Em média são poucas trocas por inserção, independentemente de n.
- **Pior caso, O(log n):** em um min-heap, o novo valor é o menor de todos (entrada em ordem decrescente). Ele sobe a cada comparação até a raiz, passando por ~log₂ n níveis. Em um max-heap, o pior caso é a entrada em ordem crescente.

### extract
- **Melhor caso, O(1):** todos os elementos são iguais (ou o heap tem poucos elementos). Depois de mover o último para a raiz, nenhum filho tem prioridade sobre ele e o sift-down para logo na primeira iteração.
- **Caso médio, O(log n):** o elemento movido para a raiz vem da última posição, que é uma folha, e por isso tende a ser um valor de baixa prioridade. Ele desce quase até o fundo da árvore.
- **Pior caso, O(log n):** o elemento movido desce até uma folha, fazendo 2 comparações e 1 troca por nível, ou seja, ~2·log₂ n comparações. Isso acontece sempre que ele tem menor prioridade que todos os caminhos abaixo dele.

Os contadores de `algoritmo.py` confirmam isso: no cenário 3, 1000 inserções decrescentes geram 7987 comparações e trocas, próximo de n·log₂ n (≈ 9965).

## Diário de Engenharia com IA
- **Ferramenta/modelo:** PREENCHER (ex.: Claude).
- **3 principais prompts:** 
  1. PREENCHER
  2. PREENCHER
  3. PREENCHER
- **Erro/ajuste manual:** PREENCHER (descreva um erro real que você encontrou e corrigiu).