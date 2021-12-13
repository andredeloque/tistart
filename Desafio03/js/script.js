import {listarProdutos} from "./util.js.js";

const produtos = document.querySelector("#produtos");
let listaDeProdutos = [
    {
        "produto": "Mamão Papaia",
        "preco": 4.70
    },

    {
        "produto": "Laranja",
        "preco": 3.70
    },

    {
        "produto": "Manga",
        "preco": 2.80
    },

    {
        "produto": "Melão",
        "preco": 6.90
    },

    {
        "produto": "Melancia",
        "preco": 5.40
    }
];

listarProdutos(listaDeProdutos, produtos);