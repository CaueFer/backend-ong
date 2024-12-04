const mysql = require("mysql2");
require("dotenv").config();

console.log(process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:  process.env.DB_DATABASE,
  port: 15480,
  connectionLimit: 10, // Número máximo de conexões no pool
  waitForConnections: true,
  connectTimeout: 60000,
  multipleStatements: true, // Permite múltiplas instruções em uma única query
});

// Mantém a conexão ativa
setInterval(() => {
  pool.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("Erro ao manter a conexão viva:", err);
    } else {
      console.log("Conexão mantida");
    }
  });
}, 30000);

module.exports = pool;
