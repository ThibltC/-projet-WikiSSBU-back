require("dotenv").config();
const password = process.env.MYSQL_PASS;

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost', // adresse du serveur
    user: 'root', // le nom d'utilisateur
    password: password, // le mot de passe
    database: 'SSBU', // le nom de la base de données
});
module.exports = connection;