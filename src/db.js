const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "junction.proxy.rlwy.net",
  user: "root",
  password: "XcrfzIUAMpoSFTAfjcoMQKHMpFWTNsOF",
  database: "railway",
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
