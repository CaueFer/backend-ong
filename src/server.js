const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const indexRouter = require("./routes/indexRouter.js");

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Doações - ONG",
      version: "1.0.0",
      description: "Documentação da API para gestão de doações",
      contact: {
        name: "ONG",
        url: "https://www.ong.org.br",
      },
    },
    servers: [
      {
        url: "https://backend-ong.vercel.app/i",
      },
    ],
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

app.use("/api", indexRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
