
const passwordValid = require ('../models/password')

module.exports = (req, res, next)=>{
    const password = req.body.password
    if (!password){
        return res.status(400).json({error: 'le mot de passe est obligatoire'})
    }
    if (!passwordValid.validate(password)) {
        return res.status(400).json({error: 'password non valide, le mot de passe doit contenir:8 caractères minimum, 1 majuscule, 1 miniscule, et pas espace'})
    } else {
        next()
    }
}