const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller.js');

/**
 * @swagger
 * /getUser:
 *   get:
 *     summary: Ver dados do usuário logado
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Sucesso
 */
authRouter.get('/getUser', authController.getUser);

/**
 * @swagger
 * /loginUser:
 *   post:
 *     summary: Fazer login do usuário
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Sucesso
 */
authRouter.post('/loginUser', authController.loginUser);

module.exports = authRouter;
