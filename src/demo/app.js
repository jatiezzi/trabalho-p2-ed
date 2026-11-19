// Simulador de Heap: cada operação vira uma lista de "frames" (passos) já calculados.
const $ = (id) => document.getElementById(id);
let frames = [], pos = -1, timer = null, cmp = 0, swp = 0, base = [];

const isMin = () => $("tipo").value === "min";
const melhor = (a, b) => (isMin() ? a < b : a > b);
const tipoTxt = () => (isMin() ? "menor" : "maior");

function frame(arr, log, hl = [], tipo = "cmp") {
  frames.push({ arr: [...arr], log, hl, tipo, cmp, swp });
}

function opInserir(v) {
  const a = [...base];
  a.push(v);
  let i = a.length - 1;
  frame(a, `Inserir ${v} na última posição (índice ${i}).`, [i], "ok");
  while (i > 0) {
    const p = (i - 1) >> 1;
    cmp++;
    frame(a, `Compara filho a[${i}]=${a[i]} com pai a[${p}]=${a[p]} (pai = (${i}-1)//2 = ${p}).`, [i, p], "cmp");
    if (melhor(a[i], a[p])) {
      [a[i], a[p]] = [a[p], a[i]]; swp++;
      frame(a, `Sift-up: ${a[p]} é ${tipoTxt()} que o pai, então troca de posição.`, [i, p], "swp");
      i = p;
    } else {
      frame(a, `Propriedade do heap respeitada. Sift-up termina.`, [i], "ok");
      break;
    }
  }
  if (i === 0 && a.length > 1) frame(a, `${a[0]} chegou à raiz.`, [0], "ok");
  base = a;
}

function opExtrair() {
  if (!base.length) { frame(base, "Heap vazio: nada para extrair.", []); return; }
  const a = [...base], raiz = a[0], ultimo = a.pop();
  frame(base, `Extrair a raiz ${raiz} (${tipoTxt()} valor do heap).`, [0], "swp");
  if (a.length) {
    a[0] = ultimo;
    frame(a, `Último elemento (${ultimo}) vai para a raiz.`, [0], "ok");
    let i = 0;
    for (;;) {
      let m = i; const e = 2 * i + 1, d = 2 * i + 2;
      if (e < a.length) { cmp++; if (melhor(a[e], a[m])) m = e; }
      if (d < a.length) { cmp++; if (melhor(a[d], a[m])) m = d; }
      const hl = [i, e, d].filter((x) => x < a.length);
      frame(a, `Sift-down em i=${i}: filhos esq=${e}, dir=${d}. Filho de maior prioridade: ${m === i ? "nenhum" : "índice " + m}.`, hl, "cmp");
      if (m === i) { frame(a, "Propriedade do heap respeitada. Sift-down termina.", [i], "ok"); break; }
      [a[i], a[m]] = [a[m], a[i]]; swp++;
      frame(a, `Troca a[${i}] com a[${m}] (rebaixa ${a[m]}).`, [i, m], "swp");
      i = m;
    }
  }
  base = a;
}

function desenhar() {
  const f = frames[pos] || { arr: [], log: "Insira valores ou carregue um cenário.", hl: [], tipo: "cmp", cmp: 0, swp: 0 };
  const W = 640, svg = $("arvore");
  let s = "";
  const xy = (i) => { const n = Math.floor(Math.log2(i + 1)), k = i + 1 - 2 ** n; return [((k + 0.5) / 2 ** n) * W, 30 + n * 62]; };
  f.arr.forEach((_, i) => { if (i > 0) { const [x1, y1] = xy(i), [x2, y2] = xy((i - 1) >> 1); s += `<line class="aresta" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; } });
  f.arr.forEach((v, i) => { const [x, y] = xy(i); const c = f.hl.includes(i) ? f.tipo : "";
    s += `<g class="no ${c}"><circle cx="${x}" cy="${y}" r="20"/><text x="${x}" y="${y}">${v}</text><text class="idx" x="${x}" y="${y + 31}">${i}</text></g>`; });
  svg.innerHTML = s;
  $("array").innerHTML = f.arr.map((v, i) => `<div class="cell ${f.hl.includes(i) ? f.tipo : ""}">${v}<small>${i}</small></div>`).join("");
  $("log").textContent = f.log;
  $("mCmp").textContent = f.cmp; $("mSwp").textContent = f.swp; $("mTam").textContent = f.arr.length;
  $("mPasso").textContent = `${pos + 1}/${frames.length}`;
}

function proximo() { if (pos < frames.length - 1) { pos++; desenhar(); } else pausar(); }
function executar() { if (!timer) timer = setInterval(proximo, 700); }
function pausar() { clearInterval(timer); timer = null; }
function reiniciar() { pausar(); frames = []; pos = -1; cmp = swp = 0; base = []; desenhar(); }

function adicionar(fn) { fn(); if (pos === -1) pos = 0; desenhar(); }
function carregar(ops) { reiniciar(); ops.forEach((o) => (o === "x" ? opExtrair() : opInserir(o))); desenhar(); }

$("play").onclick = executar;
$("pause").onclick = pausar;
$("step").onclick = () => { pausar(); proximo(); };
$("reset").onclick = reiniciar;
$("tipo").onchange = reiniciar;
$("inserir").onclick = () => { const v = parseInt($("valor").value, 10); if (!Number.isNaN(v)) { adicionar(() => opInserir(v)); pos = Math.min(pos + 1, frames.length - 1); $("valor").value = ""; desenhar(); } };
$("extrair").onclick = () => { adicionar(() => opExtrair()); pos = Math.min(pos + 1, frames.length - 1); desenhar(); };
$("medio").onclick = () => carregar([42, 17, 63, 8, 25, 51, 30, "x", "x"]);
// Pior caso: em um min-heap, valores decrescentes sobem até a raiz (em max-heap, use crescentes).
$("pior").onclick = () => carregar(isMin() ? [90, 80, 70, 60, 50, 40, 30, 20, 10] : [10, 20, 30, 40, 50, 60, 70, 80, 90]);
$("custom").onclick = () => { const l = $("lista").value.split(/[,\s]+/).map(Number).filter((n) => $("lista").value && !Number.isNaN(n)); if (l.length) carregar(l); };

desenhar();