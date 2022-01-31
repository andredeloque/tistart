const express = require("express");
const cors = require("cors");

const { Sequelize } = require("./models");

const models = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get("/", function (req, res) {
    res.send("Desafio Ciclo 3!");
});

// inserção de serviço
app.post("/servicos/novoservico", async (req, res) => {
    await servico.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// select lista de serviços
app.get("/servicos", async (req, res) => {
    await servico.findAll({
        order: [["id", "ASC"]]
    }).then(function (servicos) {
        res.json({ servicos });
    });
});

// select quantidade de serviços
app.get("/servicos/quantidade", async (req, res) => {
    await servico.count("id").then(function (servicos) {
        res.json({ servicos });
    });
});


// select para um serviço específico (com base no ID como PK)
app.get("/servicos/:id", async (req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    await servico.findByPk(req.params.id)
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Não foi possível se conectar."
            });
        });
});

// select para um serviço específico e todos os pedidos relacionados a ele
app.get("/servicos/:id/pedidos", async (req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    await itempedido.findAll({
        where: { ServicoId: req.params.id }
    })
        .then(item => {
            return res.json({
                error: false,
                item
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Não foi possível se conectar."
            });
        });
});

// update serviço
app.put("/servicos/:id/atualizarservico", async (req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    const serv = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await servico.update(serv, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço atualizado!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao alterar o serviço."
        });
    });
});

// update serviço com base no Id informado no body do Postman
app.put("/atualizarservico", async (req, res) => {
    await servico.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço atualizado!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

// delete serviço
app.get("/servicos/:id/excluirservico", async (req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    await servico.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do serviço."
        });
    });
});


// inserção de cliente
app.post("/clientes/novocliente", async (req, res) => {
    await cliente.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Cliente cadastrado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível cadastrar o cliente."
        });
    });
});

// select cliente (por ID)
app.get("/clientes/:id", async (req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    }

    await cliente.findByPk(req.params.id, { include: [{ all: true }] })
        .then(clnt => {
            return res.json({
                error: false,
                clnt
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Não foi possível se conectar"
            });
        });
});

// select lista de clientes
app.get("/clientes", async (req, res) => {
    await cliente.findAll({
        order: [["id", "ASC"]]
    }).then(function (clientes) {
        res.json({ clientes });
    });
});

// select quantidade de clientes
app.get("/clientes/quantidade", async (req, res) => {
    await cliente.count("id").then(function (clientes) {
        res.json({ clientes });
    });
});

// select para listar todos os pedidos de um cliente
app.get("/clientes/:id/pedidos", async (req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    }

    await pedido.findAll({
        where: { ClienteId: req.params.id }
    }).then(function (peds) {
        return res.json({
            error: false,
            message: "Pedidos encontrados!",
            peds
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao encontrar pedidos."
        });
    });
});

// buscando cliente e dando update com put
app.put("/clientes/:id/atualizarcliente", async (req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    }

    const clnt = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    await cliente.update(clnt, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente atualizado!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na atualização do cliente."
        });
    });
});

// delete cliente
app.get("/clientes/:id/excluircliente", async (req, res) => {
    cliente.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do cliente."
        });
    });
});

// inserção de pedido
app.post("/pedidos/novopedido", async (req, res) => {
    await pedido.create(req.body).then(ped => {
        return res.json({
            error: false,
            message: "Pedido efetuado com sucesso!", 
            ped
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao efetuar pedido."
        });
    });
});

// select lista de pedidos
app.get("/pedidos", async (req, res) => {
    await pedido.findAll({
        raw: true
    }).then(function (pedidos) {
        res.json({
            error: false,
            pedidos
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// select pedido by id
app.get("/pedidos/:id", async (req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    }

    await pedido.findByPk(req.params.id, { include: [{ all: true }] }).then(ped => {
        return res.json({
            error: false,
            ped
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// select quantidade de pedidos
app.get("/pedidos/quantidade", async (req, res) => {
    await pedido.count("id").then(function (pedidos) {
        res.json({ pedidos });
    });
});

// update do pedido
app.put("/pedidos/:id/atualizarpedido", async (req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    }

    const ped = {
        data: req.body.data,
        ClienteId: req.body.ClienteId
    };

    await pedido.update(ped, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Pedido atualizado!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na atualização do pedido."
        });
    });
});

// delete pedido
app.get("/pedidos/:id/excluirpedido", async (req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    }

    await pedido.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Pedido excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do pedido."
        });
    });
});

// inserção de item
app.post("/pedidos/:id/novo_item_pedido", async (req, res) => {
    const item = {
        PedidoId: req.params.id,
        ServicoId: req.body.ServicoId,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    }

    await itempedido.create(
        item
    ).then(function () {
        return res.json({
            error: false,
            message: "Item adicionado ao pedido com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao adicionar item no pedido."
        });
    });
});

// lista de itens pedido
app.get("/itens_pedido", async (req, res) => {
    await itempedido.findAll({
        order: [["valor", "ASC"]]
    }).then(function (itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// update itempedido
app.put("/itens_pedido/:PedidoId/:ServicoId/atualizaritem", async (req, res) => {
    if (!await pedido.findByPk(req.params.PedidoId)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    }

    if (!await servico.findByPk(req.params.ServicoId)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    await itempedido.update(item, {
        where: Sequelize.and({ PedidoId: req.params.PedidoId }, { ServicoId: req.params.ServicoId })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "Item atualizado!",
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// delete itempedido
app.get("/itens_pedido/:PedidoId/:ServicoId/excluiritem", async (req, res) => {
    if (!await pedido.findByPk(req.params.PedidoId)) {
        return res.status(400).json({
            erro: true,
            message: "Pedido não encontrado."
        });
    }

    if (!await servico.findByPk(req.params.ServicoId)) {
        return res.status(400).json({
            erro: true,
            message: "Serviço não encontrado."
        });
    }

    await itempedido.destroy({
        where: Sequelize.and({
            ServicoId: req.params.ServicoId,
            PedidoId: req.params.PedidoId
        })
    }).then(function () {
        return res.json({
            error: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do item."
        });
    });
});

// inserção produto
app.post("/produtos/novoproduto", async (req, res) => {
    await produto.create(
        req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Produto criado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro ao criar produto."
        })
    });
});

// lista de produtos
app.get("/produtos", async (req, res) => {
    await produto.findAll({
        order: [["id", "ASC"]]
    }).then(function (produtos) {
        res.json({
            error: false,
            produtos
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar."
        });
    });
});

// select produto by ID
app.get("/produtos/:id", async (req, res) => {
    if (!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    }

    await produto.findByPk(req.params.id).then(prod => {
        return res.json({
            error: false,
            prod
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível conectar."
        });
    });
});

// select para um produto específico e todos as compras relacionadas a ele
app.get("/produtos/:id/compras", async (req, res) => {
    if (!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    }

    await itemcompra.findAll({
        where: { ProdutoId: req.params.id }
    })
        .then(item => {
            return res.json({
                error: false,
                item
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Não foi possível se conectar."
            });
        });
});

// update produto
app.put("/produtos/:id/atualizarproduto", async (req, res) => {
    if (!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    }

    const prod = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await produto.update(prod, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto atualizado!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// delete produto
app.get("/produtos/:id/excluirproduto", async (req, res) => {
    if (!await produto.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    };

    await produto.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Produto excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do produto."
        });
    });
});

// inserção compra
app.post("/compras/novacompra", async (req, res) => {
    await compra.create(req.body).then(comp => {
        return res.json({
            error: false,
            message: "Compra efetuada com sucesso!",
            comp
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        })
    });
});

// select lista de compras
app.get("/compras", async (req, res) => {
    await compra.findAll({
        raw: true
    }).then(function (compras) {
        res.json({
            error: false,
            compras
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// select compras by ID
app.get("/compras/:id", async (req, res) => {
    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    }

    await compra.findByPk(req.params.id, { include: [{ all: true }] }).then(comp => {
        return res.json({
            error: false,
            comp
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// update compra
app.put("/compras/:id/atualizarcompra", async (req, res) => {
    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    }

    const comp = {
        data: req.body.data,
        ClienteId: req.body.ClienteId
    };

    await compra.update(comp, {
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra atualizada!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// delete compra
app.get("/compras/:id/excluircompra", async (req, res) => {
    if (!await compra.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    }

    await compra.destroy({
        where: { id: req.params.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Compra excluída com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// inserção itemcompra
app.post("/compras/:id/novo_item_compra", async (req, res) => {
    const item = {
        CompraId: req.params.id,
        ProdutoId: req.body.ProdutoId,
        quantidade: req.body.quantidade,
        valor: req.body.valor
    }

    await itemcompra.create(
        item
    ).then(function () {
        return res.json({
            error: false,
            message: "Item adicionado com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        })
    });
});

// lista itemcompra
app.get("/itens_compra", async (req, res) => {
    await itemcompra.findAll({
        order: [['valor', 'ASC']]
    }).then(function (itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// update itemcompra
app.put("/itens_compra/:CompraId/:ProdutoId/atualizaritem", async (req, res) => {
    if (!await compra.findByPk(req.params.CompraId)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    }

    if (!await produto.findByPk(req.params.ProdutoId)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    }

    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    await itemcompra.update(item, {
        where: Sequelize.and({ CompraId: req.params.CompraId }, { ProdutoId: req.params.ProdutoId })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "Item atualizado!",
            itens
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

// delete itemcompra
app.get("/itens_compra/:CompraId/:ProdutoId/excluiritem", async (req, res) => {
    if (!await compra.findByPk(req.params.CompraId)) {
        return res.status(400).json({
            erro: true,
            message: "Compra não encontrada."
        });
    }

    if (!await produto.findByPk(req.params.ProdutoId)) {
        return res.status(400).json({
            erro: true,
            message: "Produto não encontrado."
        });
    }

    await itemcompra.destroy({
        where: Sequelize.and({
            ProdutoId: req.params.ProdutoId,
            CompraId: req.params.CompraId
        })
    }).then(function () {
        return res.json({
            error: false,
            message: "Item excluído com sucesso!"
        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na exclusão do item."
        });
    });
});

let port = process.env.PORT || 4040;

app.listen(port, (req, res) => {
    console.log("Servidor ativo: http://localhost:4040");
});