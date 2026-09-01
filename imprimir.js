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

  const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>${titulo}</title>
<style>
  body { font-family: "IBM Plex Sans", "Segoe UI", Arial, sans-serif; color: #1E2328; margin: 30px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .subtitulo-impressao { color: #5C6870; font-size: 13px; margin: 0 0 22px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
  th, td { text-align: left; padding: 7px 10px; font-size: 12.5px; border-bottom: 1px solid #DCE3E7; }
  th.num, td.num { text-align: right; font-variant-numeric: tabular-nums; }
  thead th { text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.4px; color: #5C6870; }
  tr.linha-categoria td { background: #F6F9FA; font-weight: 700; text-transform: uppercase; font-size: 10.5px; color: #1B4F72; }
  tr.linha-total td, tr.linha-total { background: #FCEEE3 !important; font-weight: 700; }
  .selo-origem, .selo { display: none; } /* selos coloridos nao imprimem bem em P&B - o texto ja basta */
  .cartao-destaque-impressao { text-align: center; margin-bottom: 22px; }
  .cartao-destaque-impressao .rotulo { font-size: 12px; color: #5C6870; text-transform: uppercase; }
  .cartao-destaque-impressao .valor { font-size: 30px; font-weight: 700; color: #1B4F72; margin-top: 4px; }
  .rodape-impressao { text-align: center; color: #93A0A8; font-size: 10.5px; margin-top: 26px; }
  .botao-imprimir { margin-bottom: 20px; padding: 9px 18px; border-radius: 8px; border: 1px solid #1B4F72;
    background: #1B4F72; color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; }
  @media print {
    .botao-imprimir { display: none; }
    body { margin: 10px; }
  }
</style>
</head>
<body>
  <button class="botao-imprimir" onclick="window.print()">Imprimir / Salvar como PDF</button>
  <h1>${titulo}</h1>
  <p class="subtitulo-impressao">${subtitulo}</p>
  ${conteudoHtml}
  <p class="rodape-impressao">Powered by DRAM</p>
  <script>
    // abre a caixa de impressao sozinha - a pessoa so' escolhe "Salvar
    // como PDF" no destino, igual ja faz com o botao "Gerar PDF" do
    // Desktop. Um pequeno atraso garante que a pagina terminou de
    // desenhar antes de chamar a impressao.
    window.addEventListener("load", () => setTimeout(() => window.print(), 300));
  </script>
</body>
</html>`;

  janela.document.write(html);
  janela.document.close();
}
