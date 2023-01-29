const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
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

const app = express();
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/sauces',sauceRoutes);
module.exports = app;