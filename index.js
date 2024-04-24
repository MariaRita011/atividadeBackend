const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "thiagoatividade",
  password: "ds564",
  port: 5432,
});

function calcularIdade(data_nascimento) {
  let hoje = new Date();
  let dataAniversario = new Date(data_nascimento);
  let anoAtual = hoje.getFullYear();
  let anoAniversario = dataAniversario.getFullYear();
  let mesAtual = hoje.getMonth() + 1;
  let mesAniversario = dataAniversario.getMonth();
  let idade = anoAtual - anoAniversario
  
  if(mesAtual < mesAniversario) {
    idade --;
  }

  return idade;

}

function calcularSigno(data_nascimento) {

    let dataAniversario = new Date(data_nascimento);

    let mes = dataAniversario.getMonth() + 1;
    let dia = dataAniversario.getDate();

    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
      return 'Aquário';
    } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
      return 'Peixes';
    } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
      return 'Áries';
    } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
      return 'Touro';
    } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
      return 'Gêmeos';
    } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
      return 'Câncer';
    } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
      return 'Leão';
    } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
      return 'Virgem';
    } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
      return 'Libra';
    } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
      return 'Escorpião';
    } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
      return 'Sagitário';
    } else {
      return 'Capricórnio'; // Caso padrão para os demais dias de dezembro e janeiro
    }
  }

// Rota para adicionar um usuário
app.post("/usuarios", async (req, res) => {
  try {

    const { nome, sobrenome, email, data_nascimento } = req.body;

const idade = calcularIdade(data_nascimento);
const signo = calcularSigno(data_nascimento);

    await pool.query(
      "INSERT INTO usuarios (nome, sobrenome, email, data_nascimento, idade, signo) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, sobrenome, email, data_nascimento, idade, signo]
    );
    res.status(201).send({ mensagem: "Usuário adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar usuário:", error);
    res.status(500).send("Erro ao adicionar usuário");
  }
});

// Rota para obter todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json({
      total: result.rowCount,
      usuarios: result.rows,
    });
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    res.status(500).send("Erro ao obter usuários");
  }
});

// Rota para atualizar um usuário
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, email, data_nascimento } = req.body;

    const idade = calcularIdade(data_nascimento);
    const signo = calcularSigno(data_nascimento);

    await pool.query(
      "UPDATE usuarios SET nome = $1, sobrenome = $2, email = $3, data_nascimento = $4, idade = $5, signo = $6 WHERE id = $7",
      [nome, sobrenome, email, data_nascimento, idade, signo, id]
    );
    res.status(200).send({ mensagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

// Rota para excluir um usuário
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    res.status(200).send({ mensagem: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).send("Erro ao excluir usuário");
  }
});

// Rota para obter um usuário por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
      res.status(404).send({ mensagem: "Usuário não encontrado" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Erro ao obter usuário por ID:", error);
    res.status(500).send("Erro ao obter usuário por ID");
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
