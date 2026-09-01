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
// Pra adicionar um modulo novo (ex: Financeiro, quando as telas dele
// existirem): troque "ativo: false" pra "true" e preencha "itens" com as
// paginas dele, no mesmo formato dos outros modulos.

(function () {
  var MODULOS = [
    {
      chave: "vendas", nome: "Vendas", emoji: "\ud83e\uddfe", ativo: true,
      itens: [
        { nome: "Novo Pedido", href: "novo-pedido.html" },
        { nome: "Pedidos", href: "pedidos.html" },
        { nome: "Opera\u00e7\u00f5es Especiais", href: "operacoes-especiais.html" },
      ],
    },
    {
      chave: "estoque", nome: "Estoque", emoji: "\ud83d\udce6", ativo: true,
      itens: [
        { nome: "Estoque", href: "estoque.html" },
        { nome: "Ajustar Estoque", href: "ajustar-estoque.html" },
      ],
    },
    {
      chave: "cadastros", nome: "Cadastros", emoji: "\ud83d\udc64", ativo: true,
      itens: [
        { nome: "Clientes", href: "clientes.html" },
        { nome: "Tabelas de Pre\u00e7o", href: "tabelas-preco.html" },
      ],
    },
    { chave: "financeiro", nome: "Financeiro", emoji: "\ud83d\udcb0", ativo: false, itens: [] },
    {
      chave: "relatorios", nome: "Relat\u00f3rios", emoji: "\ud83d\udcca", ativo: true,
      itens: [
        { nome: "Faturamento", href: "faturamento.html" },
        { nome: "Peso Vendido", href: "peso-vendido.html" },
        { nome: "M\u00e9dias", href: "medias.html" },
      ],
    },
  ];

  var ESTILO = ""
    + ".dram-layout { display: flex; align-items: flex-start; }"
    + ".dram-sidebar { width: 168px; flex-shrink: 0; background: #123551; padding: 10px 0; }"
    + ".dram-sidebar .item-modulo { display: flex; align-items: center; gap: 10px; padding: 12px 16px;"
    + "  color: #C9DCEA; font-size: 13.5px; font-weight: 600; text-decoration: none;"
    + "  border-left: 3px solid transparent; cursor: pointer; }"
    + ".dram-sidebar .item-modulo.ativo { background: #1B4F72; color: #fff; border-left-color: #D9662F; }"
    + ".dram-sidebar .item-modulo.desabilitado { color: #5C7488; cursor: default; }"
    + ".dram-sidebar .item-modulo .tag-em-breve { margin-left: auto; font-size: 9px; color: #5C7488; text-transform: uppercase; }"
    + ".dram-coluna-direita { flex: 1; min-width: 0; }"
    + ".dram-submenu { display: flex; gap: 6px; flex-wrap: wrap; background: #EEF2F4;"
    + "  border-bottom: 1px solid #DCE3E7; padding: 10px 16px; }"
    + ".dram-submenu a { padding: 7px 14px; border-radius: 7px; border: 1.5px solid #DCE3E7; background: #fff;"
    + "  color: #1E2328; font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }"
    + ".dram-submenu a.ativa { background: #1B4F72; border-color: #1B4F72; color: #fff; }"
    + "@media (max-width: 720px) {"
    + "  .dram-layout { flex-direction: column; }"
    + "  .dram-sidebar { width: 100%; display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; padding: 6px; }"
    + "  .dram-sidebar .item-modulo { flex-shrink: 0; border-left: none; border-bottom: 3px solid transparent; }"
    + "  .dram-sidebar .item-modulo.ativo { border-bottom-color: #D9662F; border-left-color: transparent; }"
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

  function montarSidebarHtml(moduloAtivo) {
    var html = "";
    for (var i = 0; i < MODULOS.length; i++) {
      var m = MODULOS[i];
      var ativo = m === moduloAtivo;
      var classes = "item-modulo" + (ativo ? " ativo" : "") + (!m.ativo ? " desabilitado" : "");
      if (m.ativo) {
        html += '<a class="' + classes + '" href="' + m.itens[0].href + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome + "</a>";
      } else {
        html += '<span class="' + classes + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome
          + '<span class="tag-em-breve">em breve</span></span>';
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
