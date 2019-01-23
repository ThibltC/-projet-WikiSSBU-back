const express = require("express");
const connection = require("../conf");
const router = express.Router();

router.route('/')
    .post((req, res) => {
        const sql = `INSERT INTO series SET ?`
        const { name } = req.body
        connection.query(sql, { name }, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('Insertion réussie')
            }
        });
    })
    .get((req, res) => {
        const sql = 'SELECT name, id FROM series'
        connection.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })

router.route('/:id_serie')
    .put((req, res) => {
        const sql = 'UPDATE series SET ? WHERE id = ?'
        const body = { name : req.body.name }
        formData = [body, req.params.id_serie]
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })
    .delete((req, res) => {
        const sql = 'DELETE FROM series WHERE id = ?'
        connection.query(sql, req.params.id_serie, (err, results) => {
            if (err) {
                res.status(500).send(`Erreur lors de la suppression de la série`);
            } else {
                res.sendStatus(200);
            }
        })
    })

module.exports = router