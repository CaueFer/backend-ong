const express = require('express');
const dbRouter = express.Router();
const mysqlController = require('../controllers/mysql.controller.js');

/**
 * @swagger
 * /getDoacao:
 *   get:
 *     summary: Obter a lista de doações
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getDoacao', mysqlController.getDoacao);

/**
 * @swagger
 * /getSingleDoacao:
 *   get:
 *     summary: Obter uma doação específica
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getSingleDoacao', mysqlController.getSingleDoacao);

/**
 * @swagger
 * /getHistorico:
 *   get:
 *     summary: Obter o histórico de doações
 *     tags: [Histórico]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getHistorico', mysqlController.getHistorico);

/**
 * @swagger
 * /getFamilias:
 *   get:
 *     summary: Obter lista de famílias
 *     tags: [Famílias]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getFamilias', mysqlController.getFamilias);

/**
 * @swagger
 * /getTableLength:
 *   get:
 *     summary: Obter o comprimento da tabela
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getTableLength', mysqlController.getTableLength);

/**
 * @swagger
 * /getMetaFixa:
 *   get:
 *     summary: Obter meta fixa
 *     tags: [Metas]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getMetaFixa', mysqlController.getMetaFixa);

/**
 * @swagger
 * /getHistoricoByCategoria:
 *   get:
 *     summary: Obter histórico de doações por categoria
 *     tags: [Histórico]
 *     responses:
 *       200:
 *         description: Sucesso
 */
dbRouter.get('/getHistoricoByCategoria', mysqlController.getHistoricoByCategoria);

/**
 * @swagger
 * /addDoacao:
 *   post:
 *     summary: Adicionar uma nova doação
 *     tags: [Doações]
 *     responses:
 *       201:
 *         description: Doação adicionada com sucesso
 */
dbRouter.post('/addDoacao', mysqlController.addDoacao);

/**
 * @swagger
 * /addHistorico:
 *   post:
 *     summary: Adicionar um novo histórico de doações
 *     tags: [Histórico]
 *     responses:
 *       201:
 *         description: Histórico adicionado com sucesso
 */
dbRouter.post('/addHistorico', mysqlController.addHistorico);

/**
 * @swagger
 * /addFamilia:
 *   post:
 *     summary: Adicionar uma nova família
 *     tags: [Famílias]
 *     responses:
 *       201:
 *         description: Família adicionada com sucesso
 */
dbRouter.post('/addFamilia', mysqlController.addFamilia);

/**
 * @swagger
 * /addAddress:
 *   post:
 *     summary: Adicionar um novo endereço
 *     tags: [Endereços]
 *     responses:
 *       201:
 *         description: Endereço adicionado com sucesso
 */
dbRouter.post('/addAddress', mysqlController.addAddress);

/**
 * @swagger
 * /addMemberToFamilia:
 *   post:
 *     summary: Adicionar um membro a uma família
 *     tags: [Famílias]
 *     responses:
 *       201:
 *         description: Membro adicionado com sucesso à família
 */
dbRouter.post('/addMemberToFamilia', mysqlController.addMemberToFamilia);

/**
 * @swagger
 * /updateQntdInDoacao:
 *   put:
 *     summary: Atualizar quantidade em uma doação
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 */
dbRouter.put('/updateQntdInDoacao', mysqlController.updateQntdInDoacao);

/**
 * @swagger
 * /updateMetaInDoacao:
 *   put:
 *     summary: Atualizar meta em uma doação
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Meta atualizada com sucesso
 */
dbRouter.put('/updateMetaInDoacao', mysqlController.updateMetaInDoacao);

/**
 * @swagger
 * /updateDoacao:
 *   put:
 *     summary: Atualizar uma doação
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Doação atualizada com sucesso
 */
dbRouter.put('/updateDoacao', mysqlController.updateDoacao);

/**
 * @swagger
 * /updateMetaFixa:
 *   put:
 *     summary: Atualizar meta fixa
 *     tags: [Metas]
 *     responses:
 *       200:
 *         description: Meta fixa atualizada com sucesso
 */
dbRouter.put('/updateMetaFixa', mysqlController.updateMetaFixa);

/**
 * @swagger
 * /deleteDoacao:
 *   delete:
 *     summary: Deletar uma doação
 *     tags: [Doações]
 *     responses:
 *       200:
 *         description: Doação deletada com sucesso
 */
dbRouter.delete('/deleteDoacao', mysqlController.deleteDoacao);

/**
 * @swagger
 * /deleteMultiHistorico:
 *   delete:
 *     summary: Deletar múltiplos históricos de doações
 *     tags: [Histórico]
 *     responses:
 *       200:
 *         description: Históricos deletados com sucesso
 */
dbRouter.delete('/deleteMultiHistorico', mysqlController.deleteMultiHistorico);

/**
 * @swagger
 * /deleteSingleHistorico:
 *   delete:
 *     summary: Deletar um único histórico de doações
 *     tags: [Histórico]
 *     responses:
 *       200:
 *         description: Histórico deletado com sucesso
 */
dbRouter.delete('/deleteSingleHistorico', mysqlController.deleteSingleHistorico);

/**
 * @swagger
 * /deleteFamilyById:
 *   delete:
 *     summary: Deletar uma família pelo ID
 *     tags: [Famílias]
 *     responses:
 *       200:
 *         description: Família deletada com sucesso
 */
dbRouter.delete('/deleteFamilyById', mysqlController.deleteFamilyById);

module.exports = dbRouter;
