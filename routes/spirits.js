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
        const { id, name, id_series, type, rank } = req.body
        const formData = {
            id,
            name,
            type,
            path_image: req.file ? req.file.path : "path",
            id_series,
            rank
        }
        connection.query(sql, formData, (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('Insertion réussie')
            }
        });
    })
router.get('/random', (req, res) => {
    const sql =
        `SELECT
            path_image, 
            sp.name, 
            rank, 
            se.name AS name_serie, 
            sp.id 
         FROM 
            spirits AS sp, 
            series AS se 
         WHERE se.id = id_series
         ORDER BY RAND()
         LIMIT 3`
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results)
        }
    })
})

router.get('/search', (req, res) => {
    const { name, serie, type, rank, skill } = req.query;
    console.log('NAME', name)
    console.log('SKILL', skill)
    nameEsc = connection.escape(`%${name}%`);
    typeEsc = connection.escape(type);
    serieEsc = connection.escape(serie);
    rankEsc = connection.escape(rank)
    skillEsc = connection.escape(skill);
    const sql =
        `SELECT
            path_image, 
            sp.name, 
            rank, 
            type,
            se.name AS name_serie, 
            sp.id,
            sk.category AS skill_category,
            sk.text AS skill_text           
         FROM 
            spirits AS sp, 
            series AS se,
            skills AS sk 
         WHERE se.id = id_series AND sk.id = id_skills
         ${name ? "AND sp.name LIKE" + nameEsc : ""}
         ${serie ? "AND se.name=" + serieEsc : ""}
         ${type ? "AND type=" + typeEsc : ""}
         ${rank ? "AND rank=" + rankEsc : ""}
         ${skill ? "AND sk.category=" + skillEsc : ""};`
         console.log(sql,'000000000000000000000000000000000000000')
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(results)
        }
    })
})

// router.route('/:spirit_id')
//     .put((req, res) => {
//         const sql = 'UPDATE spirits SET ? WHERE id = ?'
//         formData = [req.body, req.params.spirit_id]
//         connection.query(sql, formData, (err, results) => {
//             if (err) {
//                 res.status(500).send(err);
//             } else {
//                 res.status(200).send(results)
//             }
//         })
//     })
//     .delete((req, res) => {
//         const sql = 'DELETE FROM spirits WHERE id = ?'
//         connection.query(sql, req.params.spirit_id, (err, results) => {
//             if (err) {
//                 res.status(500).send(`Erreur lors de la suppression de la série`);
//             } else {
//                 res.sendStatus(200);
//             }
//         })
//     })

module.exports = router
