const db = require("../db");

let doacoesTable = "doacoes";
let historicosTable = "historicos";
let userTable = "users";
let familiaTable = "familias";
let metaFixaTable = "metasfixas";
let enderecoTable = "enderecos";
let memberTable = "membrosfml";

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
    const results = await executeQuery(`SELECT * FROM ${doacoesTable}`);
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
      `SELECT * FROM ${doacoesTable} WHERE id = ?`,
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
    const results = await executeQuery(`SELECT * FROM ${historicosTable}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter históricos:", error);
    res.status(500).json("Erro ao obter os históricos");
  }
};

exports.getFamilias = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${familiaTable}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter famílias:", error);
    res.status(500).json("Erro ao obter as famílias");
  }
};

exports.getMembros = async (req, res) => {
  try {
    const results = await executeQuery(`SELECT * FROM ${memberTable}`);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erro ao obter membros:", error);
    res.status(500).json("Erro ao obter membros");
  }
};

exports.getMetaFixa = (req, res) => {
  const id = req.query.id;

  db.query(
    "SELECT * FROM " + metaFixaTable + " WHERE id = ?",
    id,
    (error, results, fields) => {
      if (error) {
        console.error("Erro ao obter dados:", error);
        res.status(500).json("Erro ao obter os dados");
        return;
      }
      res.status(200).json(results);
    }
  );
};

exports.getHistoricoByCategoria = (req, res) => {
  const categoria = req.query.categoria;

  const query = `
    SELECT ${historicoTable}.*
    FROM ${historicoTable}
    JOIN ${doacoesTable} ON ${historicoTable}.doacao_id = ${doacoesTable}.id
    WHERE ${doacoesTable}.categoria = ?;
  `;

  db.query(query, [categoria], (error, results) => {
    if (error) {
      console.error("Erro ao obter histórico por categoria:", error);
      res.status(500).json({ error: "Erro ao obter histórico por categoria" });
      return;
    }
    res.json(results);
  });
};

exports.getTableLength = async (req, res) => {
  try {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM ${familiaTable}) AS total_familias,
        (SELECT COUNT(*) FROM ${doacoesTable}) AS total_doacoes,
        (SELECT COUNT(*) FROM ${historicosTable}) AS total_historicos
    `;
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
    const result = await executeQuery(`INSERT INTO ${memberTable} SET ?`, [
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
    const result = await executeQuery(`INSERT INTO ${doacoesTable} SET ?`, [
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
    await executeQuery(`INSERT INTO ${historicosTable} SET ?`, [data]);
    res.status(201).json("Histórico adicionado com sucesso");
  } catch (error) {
    console.error("Erro ao adicionar histórico:", error);
    res.status(500).json("Erro ao adicionar histórico");
  }
};

exports.addFamilia = (req, res) => {
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
    INSERT INTO ${familiaTable} (resp_name, resp_sobrenome, resp_cpf, resp_email, resp_telefone, familyDesc, endereco_id)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  db.query(
    query,
    [
      respName,
      respSobrenome,
      respCpf,
      respEmail,
      respTelefone,
      familyDesc,
      endereco_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao adicionar família:", err);
        return res.status(500).send({ error: "Erro ao adicionar família" });
      }
      // Resposta com ID da nova família inserida
      res.status(201).send({ id: result.insertId });
    }
  );
};

exports.addMemberToFamilia = async (req, res) => {
  try {
    const { familyId, newMembers } = req.body;
    const familia_id = familyId;

    const values = newMembers.map((member) => [
      familia_id,
      member.membro,
      member.genero,
      member.idade,
    ]);

    const query = `
      INSERT INTO ${memberTable} (familia_id, membro, genero, idade) VALUES ?;
    `;

    const result = await db.query(query, [values]);

    res.status(201).send({ affectedRows: result.affectedRows });
  } catch (err) {
    console.error("Erro ao adicionar membro à família:", err);
    res.status(500).send({ error: "Erro ao adicionar membro à família" });
  }
};

exports.addAddress = async (req, res) => {
  const { street, number, neighborhood, city, state, zipcode, complement } =
    req.body;
  try {
    const checkQuery = `
      SELECT * FROM ${enderecoTable} 
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
        INSERT INTO ${enderecoTable} (street, number, neighborhood, city, state, zipcode, complemento)
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
      `SELECT qntd FROM ${doacoesTable} WHERE id = ?`,
      [doacao_id]
    );

    if (!doacao) {
      return res.status(404).json("Doação não encontrada");
    }

    const quantidadeAtual = doacao.qntd;
    let novaQuantidade =
      tipoMov === "entrada"
        ? quantidadeAtual + quantidadeNova
        : quantidadeAtual - quantidadeNova;
    novaQuantidade = Math.max(novaQuantidade, 0);

    await executeQuery(`UPDATE ${doacoesTable} SET qntd = ? WHERE id = ?`, [
      novaQuantidade,
      doacao_id,
    ]);
    res.status(200).json("Quantidade do item atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar quantidade da doação:", error);
    res.status(500).json("Erro ao atualizar quantidade da doação");
  }
};

exports.updateMetaFixa = async (req, res) => {
  const { id, nome, qntdMetaAll } = req.body;
  try {
    await executeQuery(
      `UPDATE ${metaFixaTable} SET nome = ?, qntdMetaAll = ? WHERE id = ?`,
      [nome, qntdMetaAll, id]
    );
    res.status(200).json("Meta fixa atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar meta fixa:", error);
    res.status(500).json("Erro ao atualizar meta fixa");
  }
};

exports.updateMetaInDoacao = (req, res) => {
  const { metaQntd, metaDate, doacao_id } = req.body;

  // Convertendo para número, se fornecido
  const qntdNova = metaQntd ? parseInt(metaQntd, 10) : null;

  const query = `
    UPDATE ${doacoesTable}
    SET metaQntd = ?, metaDate = ?
    WHERE id = ?;
  `;

  db.query(query, [qntdNova, metaDate, doacao_id], (error, results) => {
    if (error) {
      console.error("Erro ao atualizar meta do item:", error);
      return res.status(500).json({ error: "Erro ao atualizar meta do item" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }

    res.status(200).json({ message: "Meta do item atualizada com sucesso" });
  });
};

exports.updateDoacao = (req, res) => {
  const { id, categoria, itemName } = req.body;

  const query = `
    UPDATE ${doacoesTable}
    SET categoria = ?, itemName = ?
    WHERE id = ?;
  `;

  db.query(query, [categoria, itemName, id], (error, results) => {
    if (error) {
      console.error("Erro ao atualizar doação:", error);
      return res.status(500).json({ error: "Erro ao atualizar doação" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }

    res.status(200).json({ message: "Doação atualizada com sucesso" });
  });
};

exports.deleteDoacao = async (req, res) => {
  const { id } = req.query;
  try {
    await executeQuery(`DELETE FROM ${doacoesTable} WHERE id = ?`, [id]);
    res.status(200).json("Doação deletada com sucesso");
  } catch (error) {
    console.error("Erro ao deletar doação:", error);
    res.status(500).json("Erro ao deletar doação");
  }
};

exports.deleteMembro = async (req, res) => {
  const { id } = req.query;
  try {
    await executeQuery(`DELETE FROM ${memberTable} WHERE id = ?`, [id]);
    res.status(200).json("Membro deletado com sucesso");
  } catch (error) {
    console.error("Erro ao deletar membro:", error);
    res.status(500).json("Erro ao deletar membro");
  }
};
exports.deleteMultiHistorico = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  const query = `
    DELETE FROM ${historicoTable} WHERE doacao_id = ?;
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Erro ao deletar histórico:", error);
      return res.status(500).json({ error: "Erro ao deletar histórico" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum histórico encontrado para deletar" });
    }

    res.status(200).json({ message: "Histórico deletado com sucesso" });
  });
};

exports.deleteSingleHistorico = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID é obrigatório" });
  }

  const query = `
    DELETE FROM ${historicoTable} WHERE id = ?;
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Erro ao deletar histórico individual:", error);
      return res
        .status(500)
        .json({ error: "Erro ao deletar histórico individual" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Histórico individual não encontrado" });
    }

    res
      .status(200)
      .json({ message: "Histórico individual deletado com sucesso" });
  });
};

exports.deleteFamilyById = (req, res) => {
  const { id: familyId } = req.query;

  if (!familyId) {
    return res.status(400).json({ error: "ID da família é obrigatório" });
  }

  // 1. Seleciona os membros da família
  const selectQuery = `
    SELECT id FROM ${memberTable} WHERE familia_id = ?;
  `;

  db.query(selectQuery, [familyId], (error, results) => {
    if (error) {
      console.error("Erro ao selecionar membros da família:", error);
      return res
        .status(500)
        .json({ error: "Erro ao selecionar membros da família" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Família não encontrada" });
    }

    const memberIds = results.map((result) => result.id);

    // 2. Deleta os membros da família
    const deleteMembersQuery = `
      DELETE FROM ${memberTable} WHERE familia_id = ?;
    `;

    db.query(deleteMembersQuery, [familyId], (error) => {
      if (error) {
        console.error("Erro ao deletar membros da família:", error);
        return res
          .status(500)
          .json({ error: "Erro ao deletar membros da família" });
      }

      // 3. Deleta a família
      const deleteFamilyQuery = `
        DELETE FROM ${familiaTable} WHERE id = ?;
      `;

      db.query(deleteFamilyQuery, [familyId], (error) => {
        if (error) {
          console.error("Erro ao deletar família:", error);
          return res.status(500).json({ error: "Erro ao deletar família" });
        }

        res.status(200).json({ message: "Família deletada com sucesso" });
      });
    });
  });
};
