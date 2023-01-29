const Sauce = require('../models/sauces');
const fs = require('fs');
const { $where } = require('../models/sauces');

//créer une nouvelle sauce
exports.createSauce = (req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    console.log('sauceobject', sauceObject)
    delete sauceObject._id;
    delete sauceObject.userId;
    console.log('sauceobject delete', sauceObject)
    const sauce = new Sauce({
        ...sauceObject,
        _id: req.auth.userId,
        /*likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked: [],*/
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=> {res.status(201).json({message: 'sauce ajoutée'})})
        .catch((error) => {res.status(400).json({error})});
};

exports.getOneSauce = (req, res,) =>{
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {res.status(200).json(sauce);

        }
    ).catch(
        (error) => {
            res.status(404).json({ error});
        });
};
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(()=> res.status(200).json({message: 'Objet supprimé'}))
                .catch(error => res.status(401).json({ error }));
            });
        }
    ).catch(error=> {
            res.status(400).json({
                error: error
            });
        }
    );
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `&{req.protocol}://&{req.get('host')}/images/&{req.file.filename}`
    } : { ...req.body};
    delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
}
exports.getAllSauces = (req, res, next)=> {
    Sauce.find().then(
        (sauces)=> {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}
