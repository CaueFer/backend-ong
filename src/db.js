const { vault_v1 } = require("googleapis");
const mysql = require("mysql2");

const connection = mysql.createConnection(
  "mysql://root:XcrfzIUAMpoSFTAfjcoMQKHMpFWTNsOF@junction.proxy.rlwy.net:15480/railway"
);

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err.code, err.message);
    return;
  }
  console.log("DB connected");
});

module.exports = connection;