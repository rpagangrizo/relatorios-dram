// menu.js
// Menu lateral (m\u00f3dulos) + submenu horizontal (p\u00e1ginas dentro do m\u00f3dulo),
// compartilhado por todas as p\u00e1ginas internas do DRAM Web.
//
// Sistema de papeis: cada login tem um papel (admin/gerencia/producao),
// descoberto a partir do e-mail da sessao. Cada modulo (e, quando precisa
// de granularidade maior, cada item dentro do modulo) declara em
// "papeis" quem pode acessar - sem "papeis", todo mundo logado acessa.
// Um item sem "papeis" proprio herda o papeis do modulo.

(function () {
  var EMAIL_ADMIN = "raphael@arcoirisalimentos.com.br";
  var EMAILS_GERENCIA = ["fabrica@arcoirisalimentos.com.br", "contato@arcoirisalimentos.com.br"];
  var DOMINIO_PRODUCAO = "@dram.interno"; // logins de producao usam esse dominio interno, nao e' e-mail de verdade

  function obterPapel(email) {
    if (!email) return null;
    if (email === EMAIL_ADMIN) return "admin";
    if (EMAILS_GERENCIA.indexOf(email) !== -1) return "gerencia";
    if (email.indexOf(DOMINIO_PRODUCAO) !== -1) return "producao";
    return "gerencia"; // fallback seguro pra login nao mapeado
  }

  function lerSessaoDram() {
    try {
      var sessao = JSON.parse(localStorage.getItem("dram_auth") || "null");
      return (sessao && sessao.expira_em > Date.now()) ? sessao : null;
    } catch (erro) {
      return null;
    }
  }

  var MODULOS = [
    {
      chave: "vendas", nome: "Vendas", emoji: "\ud83e\uddfe", ativo: true, papeis: ["admin", "gerencia"],
      itens: [
        { nome: "Pedidos", href: "pedidos.html" },
        { nome: "Novo Pedido", href: "novo-pedido.html" },
        { nome: "Opera\u00e7\u00f5es Especiais", href: "operacoes-especiais.html" },
      ],
    },
    {
      chave: "cadastros", nome: "Cadastros", emoji: "\ud83d\udc64", ativo: true, papeis: ["admin", "gerencia"],
      itens: [
        { nome: "Clientes", href: "clientes.html" },
        { nome: "Produtos", href: "produtos.html" },
        { nome: "Tabelas de Pre\u00e7o", href: "tabelas-preco.html" },
        { nome: "Transportadoras", href: "transportadoras.html" },
        { nome: "Vendedores", href: "vendedores.html" },
      ],
    },
    {
      chave: "estoque", nome: "Estoque", emoji: "\ud83d\udce6", ativo: true, papeis: ["admin", "gerencia", "producao"],
      itens: [
        { nome: "Estoque", href: "estoque.html" },
        { nome: "Ajustar Estoque", href: "ajustar-estoque.html", papeis: ["admin", "gerencia"] },
      ],
    },
    {
      chave: "producao", nome: "Produ\u00e7\u00e3o", emoji: "\ud83c\udfed", ativo: true, papeis: ["admin", "gerencia", "producao"],
      itens: [
        { nome: "Apontamento", href: "apontamento-producao.html" },
        { nome: "Di\u00e1rio", href: "diario-producao.html" },
        { nome: "Aprova\u00e7\u00e3o", href: "aprovacao-producao.html", papeis: ["admin", "gerencia"] },
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
    + "  .dram-submenu { position: static; }"
    + "}";

  function paginaAtual() {
    var partes = location.pathname.split("/");
    return partes[partes.length - 1] || "index.html";
  }

  // acha em qual modulo e item uma pagina esta cadastrada. Devolve
  // {modulo, item} - item fica null se a pagina nao foi encontrada em
  // nenhum modulo (cai no primeiro modulo ativo, sem item especifico).
  function localizarPagina(pagina) {
    for (var i = 0; i < MODULOS.length; i++) {
      var m = MODULOS[i];
      for (var j = 0; j < m.itens.length; j++) {
        if (m.itens[j].href === pagina) return { modulo: m, item: m.itens[j] };
      }
    }
    for (var k = 0; k < MODULOS.length; k++) {
      if (MODULOS[k].ativo) return { modulo: MODULOS[k], item: null };
    }
    return { modulo: MODULOS[0], item: null };
  }

  function papeisEfetivos(modulo, item) {
    return (item && item.papeis) || modulo.papeis || null; // null = sem restricao, todo mundo logado acessa
  }

  function itemLiberado(modulo, item, papel) {
    var papeis = papeisEfetivos(modulo, item);
    return !papeis || papeis.indexOf(papel) !== -1;
  }

  function primeiroItemLiberado(modulo, papel) {
    for (var i = 0; i < modulo.itens.length; i++) {
      if (itemLiberado(modulo, modulo.itens[i], papel)) return modulo.itens[i];
    }
    return null;
  }

  function montarSidebarHtml(moduloAtivo, papel) {
    var html = "";
    for (var i = 0; i < MODULOS.length; i++) {
      var m = MODULOS[i];
      if (m.oculto) continue;
      var primeiroItem = primeiroItemLiberado(m, papel);
      var ativo = m === moduloAtivo;
      var classes = "item-modulo" + (ativo ? " ativo" : "") + (!primeiroItem ? " desabilitado" : "");
      if (primeiroItem) {
        html += '<a class="' + classes + '" href="' + primeiroItem.href + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome + "</a>";
      } else {
        html += '<span class="' + classes + '">'
          + '<span aria-hidden="true">' + m.emoji + "</span>" + m.nome + "</span>";
      }
    }
    return html;
  }

  function montarSubmenuHtml(modulo, pagina, papel) {
    var html = "";
    for (var i = 0; i < modulo.itens.length; i++) {
      var item = modulo.itens[i];
      if (!itemLiberado(modulo, item, papel)) continue; // nem aparece no submenu, pra quem nao pode acessar
      var classe = item.href === pagina ? "ativa" : "";
      html += '<a class="' + classe + '" href="' + item.href + '">' + item.nome + "</a>";
    }
    return html;
  }

  function montarMenu(moduloAtivo, papel) {
    var main = document.querySelector("main");
    if (!main) return;

    var navAntigo = document.querySelector("nav.nav-dram");
    if (navAntigo) navAntigo.remove();

    var estiloTag = document.createElement("style");
    estiloTag.textContent = ESTILO;
    document.head.appendChild(estiloTag);

    var pagina = paginaAtual();

    var sidebar = document.createElement("nav");
    sidebar.className = "dram-sidebar";
    sidebar.innerHTML = montarSidebarHtml(moduloAtivo, papel);

    var submenu = document.createElement("div");
    submenu.className = "dram-submenu";
    submenu.innerHTML = montarSubmenuHtml(moduloAtivo, pagina, papel);

    var colunaDireita = document.createElement("div");
    colunaDireita.className = "dram-coluna-direita";
    colunaDireita.appendChild(submenu);
    colunaDireita.appendChild(main);

    var layout = document.createElement("div");
    layout.className = "dram-layout";
    layout.appendChild(sidebar);
    layout.appendChild(colunaDireita);

    document.body.appendChild(layout);
  }

  // trava de acesso: roda ANTES de qualquer outra coisa, pra fechar a
  // porta pra quem digitar a URL direto numa pagina que o papel dele nao
  // pode acessar (mesmo estando logado). O "return" impede que o resto
  // do menu.js (e o script da propria pagina) continue rodando.
  var sessaoAgora = lerSessaoDram();
  var papelAgora = sessaoAgora ? obterPapel(sessaoAgora.email) : null;
  var paginaAgora = paginaAtual();
  var localizacaoAgora = localizarPagina(paginaAgora);

  if (!papelAgora || !itemLiberado(localizacaoAgora.modulo, localizacaoAgora.item, papelAgora)) {
    location.href = "index.html";
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      montarMenu(localizacaoAgora.modulo, papelAgora);
    });
  }
})();
