// imprimir.js
// Abre uma janela de impressao limpa (so' o conteudo do relatorio, sem
// menu nem filtros) - mesma ideia do botao "Gerar PDF do mês" do
// Desktop, so' que aqui quem gera o PDF de verdade e' o proprio
// navegador: a janela abre e ja chama a caixa de impressao sozinha,
// bastando a pessoa escolher "Salvar como PDF" em vez de uma impressora.
//
// Como usar numa pagina de relatorio:
//   abrirImpressao("Faturamento — Agosto de 2026", "132 pedido(s) no período", htmlDoConteudo);
// onde htmlDoConteudo e' uma string com as tabelas/cartoes prontos (pode
// reaproveitar o innerHTML que a propria tela ja montou).

function abrirImpressao(titulo, subtitulo, conteudoHtml) {
  const janela = window.open("", "_blank");
  if (!janela) {
    alert("Não consegui abrir a janela de impressão. Verifique se o navegador está bloqueando pop-ups pra esse site.");
    return;
  }

  // logo resolvido como URL absoluta (a janela abre em branco, "about:blank" -
  // um caminho relativo tipo "logo.png" nao resolveria certo ali dentro)
  const urlLogo = new URL("logo.png", window.location.href).href;
  const linhaSubtitulo = subtitulo ? `<p class="subtitulo">${subtitulo}</p>` : "";

  const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>${titulo}</title>
<style>
  /* CSS_COMUM - mesmo usado nos relatorios do DRAM Desktop, pra manter
     os PDFs gerados pelo Web identicos aos gerados pelo Desktop */
  body { font-family: Arial, sans-serif; color: #222; margin: 40px; }
  .logo { display: block; margin: 0 auto 16px; max-width: 160px; max-height: 60px; }
  h1 { font-size: 20px; margin-bottom: 2px; text-align: center; }
  .subtitulo { color: #666; font-size: 13px; margin-bottom: 24px; text-align: center; }
  .cartoes { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; justify-content: center; }
  .cartao { border: 1px solid #ccc; border-radius: 6px; padding: 10px 14px; min-width: 150px; }
  .cartao .rotulo { font-size: 11px; color: #666; }
  .cartao .valor { font-size: 17px; font-weight: bold; }
  .cartao-destaque { border: 1px solid #ccc; border-radius: 8px; padding: 22px 48px; display: inline-block; margin-bottom: 28px; text-align: center; }
  .cartao-destaque .rotulo { font-size: 14px; color: #666; }
  .cartao-destaque .valor { font-size: 36px; font-weight: bold; color: #1B4F72; margin-top: 4px; }
  h2 { font-size: 15px; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th, td { border-bottom: 1px solid #ddd; padding: 6px 8px; text-align: left; }
  th { background: #f2f2f2; }
  .num { text-align: right; }
  .vazio { text-align: center; color: #999; }
  .subgrupo { background: #eef2f7; font-weight: bold; color: #1B4F72; }
  .linha-total { font-weight: bold; border-top: 2px solid #1B4F72; }
  .rodape-dram { text-align: center; color: #999; font-size: 10px; margin-top: 40px; }
  /* extra: usado so' no comparativo de Faturamento */
  .faturamento-destaque { text-align: center; margin: 40px 0; }
  .faturamento-destaque .valor-grande { font-size: 48px; font-weight: bold; }
  .faturamento-destaque .rotulo-grande { font-size: 14px; color: #666; margin-bottom: 4px; }
  .comparacao { text-align: center; margin-top: 24px; }
  .comparacao .valor-pequeno { font-size: 16px; font-weight: bold; }
  .comparacao .rotulo-pequeno { font-size: 11px; color: #888; }
  .botao-imprimir { margin-bottom: 20px; padding: 9px 18px; border-radius: 8px; border: 1px solid #1B4F72;
    background: #1B4F72; color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: Arial, sans-serif; }
  @media print {
    body { margin: 10mm; }
    .botao-imprimir { display: none; }
  }
</style>
</head>
<body>
  <button class="botao-imprimir" onclick="window.print()">Imprimir / Salvar como PDF</button>
  <img src="${urlLogo}" class="logo" alt="Logo da empresa" onerror="this.style.display='none'">
  <h1>${titulo}</h1>
  ${linhaSubtitulo}
  ${conteudoHtml}
  <p class="rodape-dram">Gerado pelo sistema DRAM</p>
  <script>
    // abre a caixa de impressao sozinha depois que a pagina (incluindo o
    // logo) terminar de carregar - igual ja faz com o botao "Gerar PDF"
    // do Desktop
    window.addEventListener("load", () => setTimeout(() => window.print(), 300));
  </script>
</body>
</html>`;

  janela.document.write(html);
  janela.document.close();
}
