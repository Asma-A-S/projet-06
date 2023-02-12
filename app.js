// importer le framework express
const express = require('express');
//importer la bibliothèque mongoose pour accéder à la BDD mongoDB
const mongoose = require('mongoose');
//importer le middleware cors pour gérer les requêtes Cross-Origin Resource Sharing (CORS).
const cors = require('cors');
//importer le middleware path fournit des utilitaires pour travailler avec les chemins des images.
const path = require('path');
// importer helmet pour renforcer la sécurité
// de l'application en ajoutant divers en-têtes HTTP
const helmet = require('helmet');
// module pour charger les variables d'environnement à partir d'un fichier .env
const dotenv = require('dotenv');
dotenv.config();

//importer les routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');
//connecter la base de donnée à l'API
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
// appel de notre application express
const app = express();
app.use(cors())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/sauces',sauceRoutes);
module.exports = app;
