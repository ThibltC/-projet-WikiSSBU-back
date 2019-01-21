const express = require("express");
const connection = require("../conf");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.png`)
    }
})

const upload = multer({
    dest: 'tmp/',
    storage,
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('image/jpg')) {
            cb(new Error('Pas jpg'))
        }
        cb(null, true); // tout est ok, tu continues
    }
});

router.post('/uploaddufichier', upload.array('monfichier', 2), (req, res, next) => {
    res.send('Fichier uploadé avec succès');
})

router.post('/', (req, res) => {
    connection.query(`INSERT INTO esprits SET ?;`, req.body, (err, results) => {
        if (err) {
            res.status(500).send("Erreur lors de la sauvegarde d'un esprit");
        } else {
            res.status(200).json({
                id: results.insertId,
            });
        }
    });
});

module.exports = router
