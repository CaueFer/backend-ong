const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let doacaoTable = "doacoes";
let historicoTable = "historicos";
let userTable = "users";
let familyTable = "familias";
let metaFixaTable = "metasfixas";

const secretKey = "STRINGMTFODA";

exports.getUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    res.status(200).json({
      userInfos: {
        name: decoded.userName,
        email: decoded.userEmail,
        roles: decoded.userRoles,
      },
    });
  } catch (err) {
    return res.status(401).json({
      message: "JWT inválido",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await pool.query(
      `SELECT * FROM ${userTable} WHERE email = ?`,
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json("Conta não encontrada.");
    }

    const user = results[0];
    const userPass = user.passwordHash;

    const passwordMatch = await bcrypt.compare(password, userPass);

    if (!passwordMatch) {
      return res.status(406).json("Senha incorreta.");
    }

    const token = jwt.sign(
      {
        userName: user.userName,
        userEmail: user.email,
        userId: user.id,
        userRoles: user.roles,
      },
      secretKey,
      { expiresIn: "86400" } // 1 dia
    );

    return res.status(200).json({
      token: token,
      expiresIn: 86400, // 1 dia
      message: "Login efetuado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao validar login:", err);
    return res.status(500).json("Erro ao validar login.");
  }
};
