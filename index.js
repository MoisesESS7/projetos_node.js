const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//conectando ao banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso...");
}).catch((msgErro) => {
    console.log(`Erro ao conectar no banco de dados. ${msgErro}`);
})

//Informando o express para usar o EJS como view engine (que irá desenhar o HTML na tela).
app.set("view engine", "ejs");
app.use(express.static("public"));//usa os arquivos estáticos

app.use(bodyParser.urlencoded({extended: false}));//configurando o 'body-parser'
app.use(bodyParser.json());//permite a leitura de dados de fomulário enviados via 'json'.

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, 
        order: [['id', 'desc']]// ordena os dados
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas,            
        });
    });    
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {

    let id = req.params.id;
    
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [['id', 'desc']],
                attributes: ['corpo', 'updatedAt']
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {

    let corpo = req.body.corpo;
    let perguntaId = req.body.resposta;
    
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(3000, () => {
    console.log("App rodando...");
});
