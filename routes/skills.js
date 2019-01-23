const express = require("express");
const connection = require("../conf");
const router = express.Router();

router.route('/')
    .post((req, res) => {
        const sql = `INSERT INTO skills SET ?`
        const { category, text } = req.body
        const formData = { category, text }
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('Insertion réussie')
            }
        });
    })
    .get((req, res) => {
        const sql = 'SELECT category, text, id FROM skills'
        connection.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })

router.route('/:id_skills')
    .put((req, res) => {
        const sql = 'UPDATE skills SET ? WHERE id = ?'
        const { category, text } = req.body
        const body = {
            category,
            text
        }
        formData = [body, req.params.id_skills]
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })
    .delete((req, res) => {
        const sql = 'DELETE FROM skills WHERE id = ?'
        connection.query(sql, req.params.id_skills, (err, results) => {
            if (err) {
                res.status(500).send(`Erreur lors de la suppression de la compétence`);
            } else {
                res.sendStatus(200);
            }
        })
    })

module.exports = router