const listarProdutos = function(listaDeProdutos, produtos) {
    for (let item of listaDeProdutos) {
        let li = document.createElement("li"); 
        produtos.appendChild(li).textContent = item.produto; 
    };

    const produtosLi = document.querySelectorAll("#produtos > li");
    let indice = 0;

    for(let produto of produtosLi) {              
        produto.addEventListener("click", function(produto) {            
            adicionarProduto(produto, listaDeProdutos);
        });

        produto.setAttribute("id", indice);
        indice++;
    };
};

let carrinho = [];
const adicionarProduto = function(produto, listaDeProdutos) {
    let cestaDoCliente = document.querySelector("#cestaDoCliente");    
    let li = document.createElement("li");     

    if(carrinho.includes(produto.target.innerText, 0) == false) {
        cestaDoCliente.appendChild(li).textContent = produto.target.innerText;
        carrinho.push(produto.target.innerText);
        return somarTotal(produto, listaDeProdutos);
    } 
    
    alert(`Este item ${produto.target.innerText} já está na sua cesta`);
};

let total = 0.0;
const somarTotal = function(produto, listaProdutos) {
    let mostraTotalCompra = document.querySelector("#mostraTotalCompra");    

    total += listaProdutos[produto.target.id].preco;
    mostraTotalCompra.value = total.toLocaleString("pt-br", {style: "currency", currency: "BRL"});
};

export {listarProdutos};
