const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const sql = require("mssql");
const connStr = "Server=XXXXXXX;Database=XXXXX;User id=XXXXX;Password=XXXXXX;";

//inicio a aplicação com apenas um pool de conexão
sql.connect(connStr)
    .then(conn => global.conn = conn)
    .catch(err => console.log(err));

//usar o body-parser (trata requisições json)
app.use(bodyParser.urlencoded({extender: true}));
app.use(bodyParser.json());

//definindo roteador 
const router = express.Router();

//(requisições feita para a raiz)
router.get('/' , (req,res) => res.json({message: 'Funcionando'}));
app.use('/',router);

//endpoint para listar clientes
//router.get('/clientes' , (req, res) => {
//    execSqlQuery("SELECT TOP 10 rtrim(A1_CGC) , Rtrim(A1_NOME)  FROM SA1010 ORDER BY R_E_C_N_O_ DESC",res);
//})

//endpoint para listar clientes por CGC (CPF ou CNPJ)
router.get('/clientes/:cgc?' , (req, res) => {
    var filter = '';
    if (req.params.cgc) {
        filter = "  where RTRIM(LTRIM(A1_CGC)) =   '" + req.params.cgc + "' ";
    }
    execSqlQuery("SELECT TOP 10 rtrim(A1_CGC) as 'CGC' , Rtrim(A1_NOME) as 'Nome' FROM SA1010  "+ filter +" ORDER BY R_E_C_N_O_ DESC",res);
})



//subindo o serviço
app.listen(port);
console.log("API Alive!");

//endpoint clientes
function execSqlQuery( sqlQuery,res ){
    global.conn.request()
    .query(sqlQuery)
    .then(result => res.json(result.recordset))
    .catch(err => res.json(err));
}

