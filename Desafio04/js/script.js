import {dadosCep} from "./util.js";

const cep = document.querySelector("#cep");
const btnBuscar = document.querySelector("#buscar");

btnBuscar.addEventListener("click", function() {
    dadosCep(cep.value);
});