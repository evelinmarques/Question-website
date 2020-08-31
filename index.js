const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Ask"); 
const Resposta = require("./database/Answer");

//Database
connection.authenticate()
.then(() => {
    console.log("Conexão feita com o banco de dados!");
})
.catch((msgErro) => {
    console.log("msgErro");
});

// Estou dizendo para o express usar o EJS como meu view engine
app.set('view engine', 'ejs');
app.use(express.static('public')); // arquivos estaticos tipo css, imagens e etc

//Body Parser
app.use(bodyParser.urlencoded({extended: false})); //dados formulario
app.use(bodyParser.json());

// Rotas
app.get("/", (req,res) => {
    Pergunta.findAll({raw: true,order:[ //ordem das perguntas a partir do maior ID da tabela
        ['id','DESC'] // ASC = Crescente || DESC Decrescente
    ] }).then(perguntas => { // aparece somente as perguntas
        res.render("index", { // o metodo render automaticamente olha na pasta views o arquivo index. não é necessario botar o endereço da pasta;
            perguntas: perguntas
        });
    });
    
});

app.get("/ask", (req,res) => {
    res.render("perguntar");
});

app.post("/savequestion", (req,res) => { // rota para salvar perguntas no banco de dados 
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

// Buscar pergunta no banco de dados igual ao valor id
app.get("/question/:id", (req,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ //ordem das respostas
                    ['id', 'DESC'] 
                ]
            }).then(respostas => {
                res.render("question",{
                    pergunta:pergunta,
                    respostas: respostas
                }); // pagina das perguntas
            });
        }else{ // não encontrada
            res.redirect("/");
        }
    });
    });

    app.post("/answer", (req,res) => {
        var corpo = req.body.corpo;
        var perguntaId = req.body.pergunta;
        Resposta.create({
            corpo: corpo,
            perguntaId: perguntaId
        }).then(() => {
            res.redirect("/question/"+perguntaId);
        });
    });

app.listen(8080, () => {
    console.log("App rodando!");
});