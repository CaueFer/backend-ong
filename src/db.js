const mysql = require("mysql2");

const pool = mysql.createPool({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'XcrfzIUAMpoSFTAfjcoMQKHMpFWTNsOF',
  database: 'railway',
  port: 15480,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0 
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err.code, err.message);
    return;
  }
  if (connection) connection.release(); 
  console.log("DB connected");
});

module.exports = pool.promise();
