const db = require("../db");

const tables = {
  doacoes: "doacoes",
  historicos: "historicos",
  users: "users",
  familias: "familias",
  metasfixas: "metasfixas",
  enderecos: "enderecos",
  membrosfml: "membrosfml",
};

const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

exports.getDoacao = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${tables.doacoes}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter doações:", error);
    res.status(500).json("Erro ao obter as doações");
  }
};

exports.getSingleDoacao = async (req, res) => {
  const { id } = req.query;
  try {
    const results = await executeQuery(
      `SELECT * FROM ${tables.doacoes} WHERE id = ?`,
      [id]
    );
    if (results.length === 0) {
      return res.status(404).json("Doação não encontrada");
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Erro ao obter doação:", error);
    res.status(500).json("Erro ao obter a doação");
  }
};

exports.getHistorico = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${tables.historicos}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter históricos:", error);
    res.status(500).json("Erro ao obter os históricos");
  }
};

exports.getFamilias = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${tables.familias}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter famílias:", error);
    res.status(500).json("Erro ao obter as famílias");
  }
};

exports.getMembros = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${tables.membrosfml}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter membros:", error);
    res.status(500).json("Erro ao obter membros");
  }
};

exports.getMetaFixa = async (req, res) => {
  const { id } = req.query;
  try {
    const results = await executeQuery(
      `SELECT * FROM ${tables.metasfixas} WHERE id = ?`,
      [id]
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter meta fixa:", error);
    res.status(500).json("Erro ao obter meta fixa");
  }
};

exports.getHistoricoByCategoria = async (req, res) => {
  const { categoria } = req.query;
  const query = `
    SELECT ${tables.historicos}.* 
    FROM ${tables.historicos}
    JOIN ${tables.doacoes} ON ${tables.historicos}.doacao_id = ${tables.doacoes}.id
    WHERE ${tables.doacoes}.categoria = ?;
  `;
  try {
    const results = await executeQuery(query, [categoria]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter histórico por categoria:", error);
    res.status(500).json({ error: "Erro ao obter histórico por categoria" });
  }
};

exports.getTableLength = async (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM ${tables.familias}) AS total_familias,
      (SELECT COUNT(*) FROM ${tables.doacoes}) AS total_doacoes,
      (SELECT COUNT(*) FROM ${tables.historicos}) AS total_historicos
  `;
  try {
    const results = await executeQuery(query);
    const tableLengths = {
      totalFamilias: results[0].total_familias,
      totalDoacoes: results[0].total_doacoes,
      totalHistoricos: results[0].total_historicos,
    };
    res.status(200).json(tableLengths);
  } catch (error) {
    console.error("Erro ao obter o número de registros das tabelas:", error);
    res.status(500).json("Erro ao obter o número de registros das tabelas");
  }
};

exports.addMembro = async (req, res) => {
  const data = req.body;
  try {
    const result = await executeQuery(`INSERT INTO ${tables.membrosfml} SET ?`, [
      data,
    ]);
    res.status(201).json({
      message: "Membro adicionado com sucesso",
      memberId: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao adicionar membro:", error);
    res.status(500).json("Erro ao adicionar membro");
  }
};

exports.addDoacao = async (req, res) => {
  const data = req.body;
  try {
    const result = await executeQuery(`INSERT INTO ${tables.doacoes} SET ?`, [
      data,
    ]);
    res.status(201).json({
      message: "Doação adicionada com sucesso",
      doacaoId: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao adicionar doação:", error);
    res.status(500).json("Erro ao adicionar doação");
  }
};

exports.addHistorico = async (req, res) => {
  const data = req.body;
  try {
    await executeQuery(`INSERT INTO ${tables.historicos} SET ?`, [data]);
    res.status(201).json("Histórico adicionado com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar histórico:", error);
    res.status(500).json("Erro ao adicionar histórico");
  }
};

exports.addFamilia = async (req, res) => {
  const {
    respName,
    respSobrenome,
    respCpf,
    respEmail,
    respTelefone,
    familyDesc,
    endereco_id,
  } = req.body;
  const query = `
    INSERT INTO ${tables.familias} (resp_name, resp_sobrenome, resp_cpf, resp_email, resp_telefone, familyDesc, endereco_id)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  try {
    const result = await executeQuery(query, [
      respName,
      respSobrenome,
      respCpf,
      respEmail,
      respTelefone,
      familyDesc,
      endereco_id,
    ]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Erro ao adicionar família:", err);
    res.status(500).json("Erro ao adicionar família");
  }
};

exports.addAddress = async (req, res) => {
  const { street, number, neighborhood, city, state, zipcode, complement } = req.body;
  try {
    const checkQuery = `
      SELECT * FROM ${tables.enderecos}
      WHERE street = ? AND number = ? AND neighborhood = ? AND city = ? AND state = ? AND zipcode = ?
    `;
    const existingAddress = await executeQuery(checkQuery, [
      street,
      number,
      neighborhood,
      city,
      state,
      zipcode,
    ]);
    if (existingAddress.length > 0) {
      return res.status(200).json({ id: existingAddress[0].endereco_id });
    } else {
      const insertQuery = `
        INSERT INTO ${tables.enderecos} (street, number, neighborhood, city, state, zipcode, complemento)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await executeQuery(insertQuery, [
        street,
        number,
        neighborhood,
        city,
        state,
        zipcode,
        complement,
      ]);
      res.status(201).json({ id: result.insertId });
    }
  } catch (err) {
    console.error("Erro ao adicionar endereço:", err);
    res.status(500).json("Erro ao adicionar endereço");
  }
};

exports.updateQntdInDoacao = async (req, res) => {
  const { qntd, tipoMov, doacao_id } = req.body;
  const quantidadeNova = parseInt(qntd, 10);
  try {
    const [doacao] = await executeQuery(
      `SELECT qntd FROM ${tables.doacoes} WHERE id = ?`,
      [doacao_id]
    );
    if (!doacao) {
      return res.status(404).json("Doação não encontrada");
    }
    const quantidadeAtual = doacao.qntd;
    let novaQuantidade = tipoMov === "entrada"
      ? quantidadeAtual + quantidadeNova
      : quantidadeAtual - quantidadeNova;
    novaQuantidade = Math.max(novaQuantidade, 0);

    await executeQuery(`UPDATE ${tables.doacoes} SET qntd = ? WHERE id = ?`, [
      novaQuantidade,
      doacao_id,
    ]);
    res.status(200).json("Quantidade do item atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    res.status(500).json("Erro ao atualizar quantidade do item");
  }
};
