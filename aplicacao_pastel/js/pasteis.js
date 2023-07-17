let quantPasteis = 1;
let modalKeyPastel = 0;

const valorRealPastel = (valor) => {
    return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};
  
  const formatoMonetarioPastel = (valor) => {
    if (valor) {
      return valor.toFixed(2);
    }
};

const capturarKey = (e) => {
    let keyPastel = e.target.closest('.pastelInfo-sabores').getAttribute('data-key')
    console.log("Salgado Clicado " + modalKeyPastel);
    console.log(pastelJson[modalkeyPastel]);
  
    quantPasteis = 1;
  
    modalKeyPastel = keyPastel;
  
    return keyPastel;
  };

const abrirModalPasteis = () => {
    selecione(".pastelWindowArea").style.opacity = 0;
    selecione(".pastelWindowArea").style.display = "flex";
    setTimeout(() => {
      selecione(".pastelWindowArea").style.opacity = 1;
    }, 150);
};

const fecharModalPasteis = () => {
    selecione(".pastelWindowArea").style.opacity = 0;
    setTimeout(() => {
      selecione(".pastelWindowArea").style.display = "none";
    }, 500);
};

const botaoFecharPastel = () => {
    document.querySelectorAll(".pastelInfo--cancelButton, .pastelInfo--cancelMobileButton").forEach((item) => {
        item.addEventListener("click", fecharModalPasteis);
    })
}

const mudarQuantPastel = () => {
    selecione('.pastelInfo--qtmais').addEventListener("click", () => {
      quantPasteis++;
      selecione(".pastelInfo--qt").innerHTML = quantPasteis;
    });
  
    selecione('.pastelInfo--qtmenos').addEventListener('click', () => {
      if (quantPasteis > 1) {
        quantPasteis--;
        selecione(".pastelInfo--qt").innerHTML = quantPasteis;
      }
    });
};

const adicionaCarrinhoPastel = () => {
    document.querySelector(".pastelInfo--addButton").addEventListener('click', () => {
      
      let pricePastel = selecione(".pastelInfo--actualPrice").innerHTML.replace('R$ ', '');
  
      let size = modalKeyPastel;
      console.log("Sabor" + size)
  
      let identificador = pastelJson[modalKeyPastel].id+'t'+size
      console.log("Quant " + quantPasteis);
  
      let keyCart = cart.findIndex((item) => item.identificador == identificador);
      console.log(keyCart);
  
      if (keyCart > -1) {
        cart[keyCart].qt += quantPasteis;
      } else {
        let pasteis = {
          identificador,
          id: pastelJson[modalKey].id,
          qt: quantPasteis,
          price: parseFloat(pricePastel)
      }
        cart.push(pasteis);
        console.log(pasteis);
        console.log('Sub total R$ ' + (quantPasteis * pricePastel).toFixed(2))
      }
  
      fecharModalPasteis();
      abrirCarrinhoPastel();
      atualizarCarrinhoPastel();
      finalizarCompraPastel();
    });
  };

  const atualizarCarrinhoPastel = () => {
    // exibir número de itens no carrinho
    document.querySelector('.menu-openner span').innerHTML = cart.length;
  
    // mostrar ou nao o carrinho
    if (cart.length > 0) {
      // mostrar o carrinho
      document.querySelector('aside').classList.add('show');
  
      // zerar meu .cart para nao fazer insercoes duplicadas
      document.querySelector('.cart').innerHTML = '';
  
      // crie as variaveis antes do for
      let subtotal = 0;
      let total = 0;
  
      // para preencher os itens do carrinho, calcular subtotal
      for (let i in cart) {
        // use o find para pegar o item por id
        let pastelItem = pastelJson.find((item) => item.id == cart[i].id);
        console.log(pastelItem);
  
        // em cada item pegar o subtotal
        subtotal += cart[i].price * cart[i].qt;
  
        // fazer o clone, exibir na telas e depois preencher as informacoes
        let cartItem = document.querySelector('.models .cart-produtos').cloneNode(true);
        document.querySelector('.cart').append(cartItem);
  
        let pastelSizeName = cart[i].size;
        let pastelName = `${pastelItem.name} (${pastelSizeName})`;
  
        // preencher as informacoes
        cartItem.querySelector('img').src = pastelItem.img;
        cartItem.querySelector('.cart-produto-name').innerHTML = pastelName;
        cartItem.querySelector('.cart-produto-qt').innerHTML = cart[i].qt;
  
        // selecionar botoes + e -
        cartItem.querySelector('.cart-produto-qtmais').addEventListener('click', () => {
          console.log('Clicou no botão mais');
          // adicionar apenas a quantidade que esta neste contexto
          cart[i].qt++;
          // atualizar a quantidade
          atualizarCarrinhoPastel();
        });
  
        cartItem.querySelector('.cart-produto-qtmenos').addEventListener('click', () => {
          console.log('Clicou no botão menos');
          if (cart[i].qt > 1) {
            // subtrair apenas a quantidade que esta neste contexto
            cart[i].qt--;
          } else {
            // remover se for zero
            cart.splice(i, 1);
          }
  
          (cart.length < 1) ? document.querySelector('header').style.display = 'flex' : '';
  
          // atualizar a quantidade
          atualizarCarrinhoPastel();
        });
  
        document.querySelector('.cart').append(cartItem);
      } // fim do for
  
      // fora do for
      total = subtotal;
  
      // exibir na tela os resultados
      // selecionar o ultimo span do elemento
      document.querySelector('.subtotal span:last-child').innerHTML = valorRealPastel(subtotal);
      document.querySelector('.total span:last-child').innerHTML = valorRealPastel(total);
    } else {
      // ocultar o carrinho
      document.querySelector('aside').classList.remove('show');
      document.querySelector('aside').style.left = '100vw';
    }
  };

const finalizarCompraPastel = () => {
    selecione('.cart--finalizar').addEventListener('click', () => {
      console.log('Finalizar compra');
      cart = [];
      selecione(".menu-openner span").innerHTML = 0;
      selecione('aside').classList.remove('show');
      selecione('aside').style.left = '100vw';
      selecione('header').style.display = 'flex';
      atualizarCarrinhoPastel();
    });
  };

const abrirCarrinhoPastel = () => {
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

const fecharCarrinhoPastel = () => {
    selecione(".menu-closer").addEventListener('click', () => {
      selecione('aside').style.left = '100vw';
      selecione('header').style.display = 'flex';
    });
};

const preencheDadosPasteis = (pedidoPasteis, item, index) => {
    pedidoPasteis.setAttribute('data-key', index)
    pedidoPasteis.querySelector(".produto-item-pastel-img img").src = item.img;
    pedidoPasteis.querySelector(".produto-item-pastel-price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pedidoPasteis.querySelector(".produto-item-pastel-name").innerHTML = item.name;
    pedidoPasteis.querySelector(".produto-item-pastel-desc").innerHTML = item.description;
};

const preencheDadosModalPastel = (item) => {
    selecione(".pastelBig img").src = item.img;
    selecione(".pasteisInfo h1").innerHTML = item.name;
    selecione(".pastelInfo--desc").innerHTML = item.description;
    selecione(".pastelInfo--actualPrice").innerHTML = `R$ ${item.price.toFixed(2)}`;
  };

pastelJson.map((item, index) => {
    let pedidoPasteis = document.querySelector(".models .produtos-item-pasteis").cloneNode(true);

    selecione(".pastel-area").appendChild(pedidoPasteis);
  
    preencheDadosPasteis(pedidoPasteis, item,);

    pedidoPasteis.addEventListener('click', (e) => {
        e.preventDefault();

        abrirModalPasteis();

        preencheDadosModalPastel(item);
    })
    botaoFecharPastel();
})

mudarQuantPastel();

fecharModalPasteis();
abrirCarrinhoPastel();
adicionaCarrinhoPastel();
atualizarCarrinhoPastel();
finalizarCompraPastel();