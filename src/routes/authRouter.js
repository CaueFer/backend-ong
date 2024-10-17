const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller.js");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /getUser:
 *   get:
 *     summary: Obter informações do usuário
 *     description: Enviar o JWT TOKEN para o servidor, ele retorna as informacoes do usuario.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso ao obter as informações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: O ID do usuário
 *                   example: 123456
 *                 name:
 *                   type: string
 *                   description: O nome do usuário
 *                   example: João Silva
 *                 email:
 *                   type: string
 *                   description: O e-mail do usuário
 *                   example: joao.silva@example.com
 *       401:
 *         description: Token JWT inválido ou ausente
 */
authRouter.get("/getUser", authController.getUser);

/**
 * @swagger
 * /loginUser:
 *   post:
 *     summary: Fazer login do usuário
 *     description: Enviar email e senha, o servidor retorna um JWT TOKEN
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: O e-mail do usuário
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: A senha do usuário
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Sucesso
 */
authRouter.post("/loginUser", authController.loginUser);

module.exports = authRouter;
