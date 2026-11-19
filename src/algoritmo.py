from __future__ import annotations

import math
from typing import List


class Heap:

    def __init__(self, tipo: str = "min") -> None:
        if tipo not in ("min", "max"):
            raise ValueError("tipo deve ser 'min' ou 'max'")
        self.tipo: str = tipo
        self.dados: List[int] = []
        self.comparacoes: int = 0
        self.trocas: int = 0

    @staticmethod
    def pai(i: int) -> int:
        return (i - 1) // 2

    @staticmethod
    def esq(i: int) -> int:
        return 2 * i + 1

    @staticmethod
    def dir(i: int) -> int:
        return 2 * i + 2

    def _tem_prioridade(self, a: int, b: int) -> bool:
        """True se 'a' deve ficar acima de 'b'. Conta 1 comparação."""
        self.comparacoes += 1
        return a < b if self.tipo == "min" else a > b

    def _trocar(self, i: int, j: int) -> None:
        self.dados[i], self.dados[j] = self.dados[j], self.dados[i]
        self.trocas += 1

    def _sift_up(self, i: int) -> None:
        """Promove o elemento enquanto ele tiver prioridade sobre o pai."""
        while i > 0:
            p = self.pai(i)
            if not self._tem_prioridade(self.dados[i], self.dados[p]):
                break
            self._trocar(i, p)
            i = p

    def _sift_down(self, i: int) -> None:
        """Rebaixa o elemento trocando com o filho de maior prioridade."""
        n = len(self.dados)
        while True:
            melhor = i
            e, d = self.esq(i), self.dir(i)
            if e < n and self._tem_prioridade(self.dados[e], self.dados[melhor]):
                melhor = e
            if d < n and self._tem_prioridade(self.dados[d], self.dados[melhor]):
                melhor = d
            if melhor == i:
                break
            self._trocar(i, melhor)
            i = melhor

    def inserir(self, valor: int) -> None:
        """Insere no fim e aplica sift-up. Custo O(log n)."""
        self.dados.append(valor)
        self._sift_up(len(self.dados) - 1)

    def extrair(self) -> int:
        """Remove e devolve a raiz (menor no min-heap / maior no max-heap). O(log n)."""
        if not self.dados:
            raise IndexError("heap vazio")
        raiz = self.dados[0]
        ultimo = self.dados.pop()
        if self.dados:
            self.dados[0] = ultimo
            self._sift_down(0)
        return raiz

    def espiar(self) -> int:
        """Devolve a raiz sem remover. O(1)."""
        if not self.dados:
            raise IndexError("heap vazio")
        return self.dados[0]

    def __len__(self) -> int:
        return len(self.dados)

    def zerar_contadores(self) -> None:
        self.comparacoes = 0
        self.trocas = 0


if __name__ == "__main__":
    # Cenário 1 
    h = Heap("min")
    for v in [42, 17, 63, 8, 25, 51, 30]:
        h.inserir(v)
    print("Cenário 1 | array:", h.dados, "| raiz:", h.espiar())
    saida = [h.extrair() for _ in range(len(h))]
    print("  extração:", saida, "| comparações:", h.comparacoes, "| trocas:", h.trocas)
    assert saida == sorted(saida)

    # Cenário 2 
    h = Heap("max")
    try:
        h.extrair()
    except IndexError as erro:
        print("Cenário 2 | extrair em heap vazio ->", erro)
    for v in [5, 5, 5, 9]:
        h.inserir(v)
    print("  max-heap com duplicados:", h.dados, "| raiz:", h.espiar())
    assert h.extrair() == 9 and h.extrair() == 5

    # Cenário 3
    n = 1000
    h = Heap("min")
    for v in range(n, 0, -1):
        h.inserir(v)
    print(f"Cenário 3 | {n} inserções decrescentes -> comparações: {h.comparacoes}, "
          f"trocas: {h.trocas} (n*log2(n) ≈ {int(n * math.log2(n))})")