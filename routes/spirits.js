const express = require("express");
const connection = require("../conf");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/spirits')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.png`)
    }
})

const upload = multer({
    dest: 'tmp/',
    storage,
    limits: {
        fileSize: 3 * 1024 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const verifyMimetype = ['image/jpg', 'image/jpeg', 'image/png']
        if (!verifyMimetype.includes(file.mimetype)) {
            cb(new Error('MAUVAIS FORMAT. Formats acceptés : jpeg,jpg,png'))
        }
        cb(null, true);
    }
});


router.route('/')
    .post(upload.single('picture_spirit'), (req, res) => {
        const sql = `INSERT INTO spirits SET ?`
        const { id, name, id_series, type } = req.body
        const formData = {
            id,
            name,
            type,
            path_image: req.file ? req.file.path : "path",
            id_series
        }
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('Insertion réussie')
            }
        });
    })
    .get((req, res) => {
        const sql = 'SELECT path_image FROM spirits'
        connection.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })

router.route('/:spirit_name')
    .put((req, res) => {
        const sql = 'UPDATE name SET ? WHERE name = ?'
        formData = [req.body, req.params.spirit_name]
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(results)
            }
        })
    })
    .delete((req, res) => {
        const sql = 'DELETE FROM spirits WHERE name = ?'
        connection.query(sql, req.params.spirit_name, (err, results) => {
            if (err) {
                res.status(500).send(`Erreur lors de la suppression de la série`);
            } else {
                res.sendStatus(200);
            }
        })
    })

module.exports = router
