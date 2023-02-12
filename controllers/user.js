// bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require ('bcrypt');
// importer jwt pour pouvoir générer des tokens
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//vérifier si le format email est valide avec regex
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.signup = (req, res) => {
    const email = req.body.email
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'format email non valide' });
      }
    //saler le mot de passe 12 fois et le hacher, sécurité
    bcrypt.hash(req.body.password, 12)
    .then(hash => {
        const user = new User({
            email: email,
            password: hash
        });
        user.save()
        .then(()=> res.status(201).json({message: 'utilisateur créé'}))
        .catch((error) => res.status(400).json({message: error }));
    })
    .catch((error) => res.status(500).json({error}))
};
exports.login = async (req, res) => {
    try { 
        //on vérifie si l'utilisateur est dans la BDD
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(401).json({ message: 'paire email/password incorrecte' });
            return;
        }
        //On utilise bcrypt pour comparer les hashs et savoir s'ils ont la même string d'origine
        const isPasswordOk = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordOk) {
            res.status(403).json({ message: 'paire email/password incorrecte' });
            return;
        }
        res.status(200).json({
            userId: user?._id,
            //on utilise sign pour chiffrer le token
            token: jwt.sign(
                { userId: user?._id }, 
                //clé secrète pour chiffrer le token
                process.env.JWT_PASSWORD, 
                { expiresIn: '24h' })
        });
    } catch (error) {
        res.status(500).json({ error });
    }
}