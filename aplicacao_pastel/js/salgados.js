const selecione = (elemento) => document.querySelector(elemento);
const selecioneTodos = (elemento) => document.querySelectorAll(elemento);

let modalKey = 0;
let quantSalgados = 1;
let cart = [];

const valorReal = (valor) => {
  return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

const formatoMonetario = (valor) => {
  if (valor) {
    return valor.toFixed(2);
  }
};

const pegarKey = (e) => {
  let key = e.target.closest('.salgados-item').getAttribute('data-key')
  console.log("Salgado Clicado " + modalKey);
  console.log(foodJson[key]);

  quantSalgados = 1;

  modalKey = key;

  return key;
};

const abrirModal = () => {
  selecione(".salgadoWindowArea").style.opacity = 0;
  selecione(".salgadoWindowArea").style.display = "flex";
  setTimeout(() => {
    selecione(".salgadoWindowArea").style.opacity = 1;
  }, 150);
};

const fecharModal = () => {
  selecione(".salgadoWindowArea").style.opacity = 0;
  setTimeout(() => {
    selecione(".salgadoWindowArea").style.display = "none";
  }, 500);
};

const botaoFechar = () => {
  selecioneTodos(".salgadoInfo--cancelButton, .salgadoInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", fecharModal);
  });
};

const preencheDados = (pedidoSalgados, item, index) => {
  pedidoSalgados.setAttribute('data-key', index)
  pedidoSalgados.querySelector(".produto-item-img img").src = item.img;
  pedidoSalgados.querySelector(".produto-item-price").innerHTML = `R$ ${item.price.toFixed(2)}`;
  pedidoSalgados.querySelector(".produto-item-name").innerHTML = item.name;
  pedidoSalgados.querySelector(".produto-item-desc").innerHTML = item.description;
};

const mudarQuant = () => {
  selecione('.salgadoInfo--qtmais').addEventListener("click", () => {
    quantSalgados++;
    selecione(".salgadoInfo--qt").innerHTML = quantSalgados;
  });

  selecione('.salgadoInfo--qtmenos').addEventListener('click', () => {
    if (quantSalgados > 1) {
      quantSalgados--;
      selecione(".salgadoInfo--qt").innerHTML = quantSalgados;
    }
  });
};

const adicionaCarrinho = () => {
  selecione(".salgadoInfo--addButton").addEventListener('click', () => {
    
    let priceSalgado = selecione(".salgadoInfo--actualPrice").innerHTML.replace('R$ ', '');

    let size = selecione(".salgadosInfo-sabores").getAttribute('data-key')
    console.log("Sabor" + size)

    let identificador = foodJson[modalKey].id+'t'+size
    console.log("Quant " + quantSalgados);

    let keyCart = cart.findIndex((item) => item.identificador == identificador);
    console.log(keyCart);

    if (keyCart > -1) {
      cart[keyCart].qt += quantSalgados;
    } else {
      let salgado = {
        identificador,
        id: foodJson[modalKey].id,
        qt: quantSalgados,
        price: parseFloat(priceSalgado)
    }
      cart.push(salgado);
      console.log(salgado);
      console.log('Sub total R$ ' + (quantSalgados * priceSalgado).toFixed(2))
    }

    fecharModal();
    abrirCarrinho();
    atualizarCarrinho();
    finalizarCompra();
  });
};

const atualizarCarrinho = () => {
  // exibir número de itens no carrinho
selecione('.menu-openner span').innerHTML = cart.length

// mostrar ou nao o carrinho
if(cart.length > 0) {

  // mostrar o carrinho
  selecione('aside').classList.add('show')

  // zerar meu .cart para nao fazer insercoes duplicadas
  selecione('.cart').innerHTML = ''

  // crie as variaveis antes do for
  let subtotal = 0
  let desconto = 0
  let total    = 0

  // para preencher os itens do carrinho, calcular subtotal
  for(let i in cart) {
    // use o find para pegar o item por id
    let salgadoItem = foodJson.find( (item) => item.id == cart[i].id )
    console.log(salgadoItem)

    // em cada item pegar o subtotal
    subtotal += cart[i].price * cart[i].qt
    //console.log(cart[i].price)

    // fazer o clone, exibir na telas e depois preencher as informacoes
    let cartItem = selecione('.models .cart-produtos').cloneNode(true)
    selecione('.cart').append(cartItem)

    let salgadoSizeName = cart[i].size

    let salgadoName = `${salgadoItem.name} (${salgadoSizeName})`

    // preencher as informacoes
    cartItem.querySelector('img').src = salgadoItem.img
    cartItem.querySelector('.cart-produto-name').innerHTML = salgadoName
    cartItem.querySelector('.cart-produto-qt').innerHTML = cart[i].qt

    // selecioner botoes + e -
    cartItem.querySelector('.cart-produto-qtmais').addEventListener('click', () => {
      console.log('Clicou no botão mais')
      // adicionar apenas a quantidade que esta neste contexto
      cart[i].qt++
      // atualizar a quantidade
      atualizarCarrinho()
    })

    cartItem.querySelector('.cart-produto-qtmenos').addEventListener('click', () => {
      console.log('Clicou no botão menos')
      if(cart[i].qt > 1) {
        // subtrair apenas a quantidade que esta neste contexto
        cart[i].qt--
      } else {
        // remover se for zero
        cart.splice(i, 1)
      }

        (cart.length < 1) ? selecione('header').style.display = 'flex' : ''

      // atualizar a quantidade
      atualizarCarrinho()
    })

    selecione('.cart').append(cartItem)

  } // fim do for

  // fora do for
  total = subtotal

  // exibir na tela os resultados
  // selecioner o ultimo span do elemento
  selecione('.subtotal span:last-child').innerHTML = valorReal(subtotal)
  selecione('.total span:last-child').innerHTML    = valorReal(total)

} else {
  // ocultar o carrinho
  selecione('aside').classList.remove('show')
  selecione('aside').style.left = '100vw'
}
}

const finalizarCompra = () => {
  selecione('.cart--finalizar').addEventListener('click', () => {
    console.log('Finalizar compra');
    cart = [];
    selecione(".menu-openner span").innerHTML = 0;
    selecione('aside').classList.remove('show');
    selecione('aside').style.left = '100vw';
    selecione('header').style.display = 'flex';
    atualizarCarrinho();
  });
};

const abrirCarrinho = () => {
  console.log('Qtd do carrinho: ' + cart.length);
  if (cart.length > 0) {
    selecione('aside').classList.add('show');
    selecione('header').style.display = 'flex';
  }

  selecione(".menu-openner").addEventListener('click', () => {
    selecione('aside').classList.add('show');
    selecione('aside').style.left = '0';
  });
};

const fecharCarrinho = () => {
  selecione(".menu-closer").addEventListener('click', () => {
    selecione('aside').style.left = '100vw';
    selecione('header').style.display = 'flex';
  });
};

const preencheDadosModal = (item) => {
  selecione(".salgadoBig img").src = item.img;
  selecione(".salgadosInfo h1").innerHTML = item.name;
  selecione(".salgadoInfo--desc").innerHTML = item.description;
  selecione(".salgadoInfo--actualPrice").innerHTML = `R$ ${item.price.toFixed(2)}`;
};

foodJson.map((item, index) => {
  let pedidoSalgados = document.querySelector(".models .produtos-item").cloneNode(true);

  selecione(".salgado-area").appendChild(pedidoSalgados);

  preencheDados(pedidoSalgados, item, index);

  pedidoSalgados.querySelector(".produtos-item a").addEventListener("click", (event) => {
    event.preventDefault();

    abrirModal();

    preencheDadosModal(item);
  });

  botaoFechar();
});

mudarQuant();
adicionaCarrinho();
abrirCarrinho()
fecharCarrinho()
atualizarCarrinho()
finalizarCompra()