// menu.js
// Menu lateral (m\u00f3dulos) + submenu horizontal (p\u00e1ginas dentro do m\u00f3dulo),
// compartilhado por todas as p\u00e1ginas internas do DRAM Web. Substitui a
// antiga <nav class="nav-dram"> (fileira \u00fanica horizontal) que cada
// p\u00e1gina tinha copiada e colada.
//
// Como usar numa p\u00e1gina nova: coloque <script src="menu.js"></script>
// no lugar onde ficava a <nav class="nav-dram">...</nav>, e cadastre a
// p\u00e1gina dentro do MODULO certo na lista abaixo. Nao precisa de mais
// nada - o menu se monta sozinho, detectando a p\u00e1gina atual pela URL.
//
// Financeiro e Relat\u00f3rios foram REMOVIDOS de vez (n\u00e3o s\u00f3 ocultos) -
// o Desktop voltou a ser a fonte \u00fanica desses dois m\u00f3dulos. Os arquivos
// HTML correspondentes tamb\u00e9m foram apagados do GitHub.

(function () {
  var MODULOS = [
    {
      chave: "vendas", nome: "Vendas", emoji: "\ud83e\uddfe", ativo: true,
      itens: [
        { nome: "Novo Pedido", href: "novo-pedido.html" },
        { nome: "Opera\u00e7\u00f5es Especiais", href: "operacoes-especiais.html" },
        { nome: "Pedidos", href: "pedidos.html" },
      ],
    },
    {
      chave: "cadastros", nome: "Cadastros", emoji: "\ud83d\udc64", ativo: true,
      itens: [
        { nome: "Clientes", href: "clientes.html" },
        { nome: "Produtos", href: "produtos.html" },
        { nome: "Tabelas de Pre\u00e7o", href: "tabelas-preco.html" },
        { nome: "Transportadoras", href: "transportadoras.html" },
        { nome: "Vendedores", href: "vendedores.html" },
      ],
    },
    {
      chave: "estoque", nome: "Estoque", emoji: "\ud83d\udce6", ativo: true,
      itens: [
        { nome: "Ajustar Estoque", href: "ajustar-estoque.html" },
        { nome: "Estoque", href: "estoque.html" },
      ],
    },
    {
      chave: "producao", nome: "Produ\u00e7\u00e3o", emoji: "\ud83c\udfed", ativo: true,
      itens: [
        { nome: "Apontamento", href: "apontamento-producao.html" },
        { nome: "Aprova\u00e7\u00e3o", href: "aprovacao-producao.html" },
      ],
    },
  ];

  var ESTILO = ""
    + ".dram-layout { display: flex; align-items: flex-start; }"
    + ".dram-sidebar { width: 168px; flex-shrink: 0; background: #123551; padding: 10px 0;"
    + "  position: sticky; top: 0; height: 100vh; overflow-y: auto; z-index: 20; }"
    + ".dram-sidebar .item-modulo { display: flex; align-items: center; gap: 10px; padding: 12px 16px;"
    + "  color: #C9DCEA; font-size: 13.5px; font-weight: 600; text-decoration: none;"
    + "  border-left: 3px solid transparent; cursor: pointer; }"
    + ".dram-sidebar .item-modulo.ativo { background: #1B4F72; color: #fff; border-left-color: #D9662F; }"
    + ".dram-sidebar .item-modulo.desabilitado { color: #5C7488; cursor: default; }"
    + ".dram-sidebar .item-modulo .tag-em-breve { margin-left: auto; font-size: 9px; color: #5C7488; text-transform: uppercase; }"
    + ".dram-coluna-direita { flex: 1; min-width: 0; }"
    + ".dram-submenu { display: flex; gap: 6px; flex-wrap: wrap; background: #EEF2F4;"
    + "  border-bottom: 1px solid #DCE3E7; padding: 10px 16px;"
    + "  position: sticky; top: 0; z-index: 10; }"
    + ".dram-submenu a { padding: 7px 14px; border-radius: 7px; border: 1.5px solid #DCE3E7; background: #fff;"
    + "  color: #1E2328; font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }"
    + ".dram-submenu a.ativa { background: #1B4F72; border-color: #1B4F72; color: #fff; }"
    + "@media (max-width: 720px) {"
    + "  .dram-layout { flex-direction: column; }"
    + "  .dram-sidebar { width: 100%; height: auto; position: sticky; top: 0;"
    + "    display: flex; overflow-x: auto; overflow-y: visible; -webkit-overflow-scrolling: touch; padding: 6px; }"
    + "  .dram-sidebar .item-modulo { flex-shrink: 0; border-left: none; border-bottom: 3px solid transparent; }"
    + "  .dram-sidebar .item-modulo.ativo { border-bottom-color: #D9662F; border-left-color: transparent; }"
    + "  .dram-submenu { position: static; }" // no celular, so' a sidebar fica fixa (evita sobrepor o submenu)
    + "}";

  function paginaAtual() {
    var partes = location.pathname.split("/");
    return partes[partes.length - 1] || "index.html";
  }

  function moduloDaPagina(pagina) {
    for (var i = 0; i < MODULOS.length; i++) {
      var m = MODULOS[i];
      for (var j = 0; j < m.itens.length; j++) {
        if (m.itens[j].href === pagina) return m;
      }
    }
    // pagina nao cadastrada em nenhum modulo (ex: pagina nova, esquecida
    // de cadastrar aqui) - cai no primeiro modulo ativo, sem quebrar
    for (var k = 0; k < MODULOS.length; k++) {
      if (MODULOS[k].ativo) return MODULOS[k];
    }
    return MODULOS[0];
  }

  function moduloLiberado(m) {
    return m.ativo;
  }

  function montarSidebarHtml(moduloAtivo) {
    var html = "";
    for (var i = 0; i < MODULOS.length; i++) {
      var m = MODULOS[i];
      if (m.oculto) continue; // nem aparece na sidebar - nao e' so' desabilitado
      var liberado = moduloLiberado(m);
      var ativo = m === moduloAtivo;
      var classes = "item-modulo" + (ativo ? " ativo" : "") + (!liberado ? " desabilitado" : "");
      if (liberado) {
        html += '<a class="' + classes + '" href="' + m.itens[0].href + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome + "</a>";
      } else {
        var textoTag = m.ativo ? "" : "em breve";
        html += '<span class="' + classes + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome
          + (textoTag ? '<span class="tag-em-breve">' + textoTag + "</span>" : "") + "</span>";
      }
    }
    return html;
  }

  function montarSubmenuHtml(modulo, pagina) {
    var html = "";
    for (var i = 0; i < modulo.itens.length; i++) {
      var item = modulo.itens[i];
      var classe = item.href === pagina ? "ativa" : "";
      html += '<a class="' + classe + '" href="' + item.href + '">' + item.nome + "</a>";
    }
    return html;
  }

  function montarMenu() {
    var main = document.querySelector("main");
    if (!main) return; // seguranca: sem <main> na pagina, nao mexe em nada

    var navAntigo = document.querySelector("nav.nav-dram");
    if (navAntigo) navAntigo.remove();

    var estiloTag = document.createElement("style");
    estiloTag.textContent = ESTILO;
    document.head.appendChild(estiloTag);

    var pagina = paginaAtual();
    var modulo = moduloDaPagina(pagina);

    var sidebar = document.createElement("nav");
    sidebar.className = "dram-sidebar";
    sidebar.innerHTML = montarSidebarHtml(modulo);

    var submenu = document.createElement("div");
    submenu.className = "dram-submenu";
    submenu.innerHTML = montarSubmenuHtml(modulo, pagina);

    var colunaDireita = document.createElement("div");
    colunaDireita.className = "dram-coluna-direita";
    colunaDireita.appendChild(submenu);
    colunaDireita.appendChild(main); // move o <main> original pra dentro da coluna, sem mudar seu conteudo

    var layout = document.createElement("div");
    layout.className = "dram-layout";
    layout.appendChild(sidebar);
    layout.appendChild(colunaDireita);

    document.body.appendChild(layout);
  }

  document.addEventListener("DOMContentLoaded", montarMenu);
})();
