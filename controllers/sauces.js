const Sauce = require('../models/sauces');
const fs = require('fs');
// afficher toutes les sauces
exports.getAllSauces = (req, res)=> {
    Sauce.find({})
        .then((sauces)=> res.status(200).json(sauces))
        .catch((error) => res.status(400).json({error: error}))
}
//afficher une sauce
exports.getOneSauce = (req, res) =>{
    const { id }= req.params
    Sauce.findById(id)
    .then(sauce =>res.status(200).json(sauce))
    .catch(
        (error) => {
            res.status(404).json({ error});
        })
};
//créer une nouvelle sauce en supprimant l'id fournit pas le front end
exports.createSauce = (req, res)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=> {res.status(201).json({message: 'sauce ajoutée'})})
        .catch((error) => {res.status(400).json({message: 'probleme'})});
};

//supprimer une sauce
exports.deleteSauce = (req, res) => {
  const { id } = req.params
    Sauce.findById(id)
    .then(sauce => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message : 'Not authorized'});
      } else{
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id})
                .then(()=> res.status(200).json({message: 'Objet supprimé'}))
                .catch(error => res.status(401).json({ error }));
            });
        }}
    ).catch(error=> {
            res.status(400).json({
                error: error
            });
        }
    );
};

//modifie une sauce
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    delete sauceObject._userId;
    const { id } = req.params
   Sauce.findById(id)
       .then((sauce) => {
           if (sauce.userId !== req.auth.userId) {
               res.status(403).json({ message : 'Non autorisé'});
           } else {
               Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
}
exports.sauceLike = async (req, res) => {
    try {
      const sauce = await Sauce.findOne({ _id: req.params.id });
      if (!sauce) {
        return res.status(404).json({ message: 'Sauce not found' });
      }
      const like = req.body.like;
      switch (like) {
        case 1:
          if (sauce.usersLiked.includes(req.auth.userId)) {
            return res.status(401).json({ message: 'vous avez déjâ liké cette sauce' });
          }
          await Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: like },
            $push: { usersLiked: req.auth.userId },
          });
          return res.status(200).json({ message: 'Sauce appréciée' });
        case -1:
          if (sauce.usersDisliked.includes(req.auth.userId)) {
            return res.status(401).json({ message: 'vous avez déjâ disliké cette sauce' });
          }
          await Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: -1 * like },
            $push: { usersDisliked: req.auth.userId },
          });
          return res.status(200).json({ message: 'Sauce non appréciée' });
        case 0:
          if (sauce.usersLiked.includes(req.auth.userId)) {
            await Sauce.updateOne({ _id: req.params.id }, {
              $pull: { usersLiked: req.auth.userId },
              $inc: { likes: -1 },
            });
            return res.status(200).json({ message: 'Like retiré' });
          } else if (sauce.usersDisliked.includes(req.auth.userId)) {
            await Sauce.updateOne({ _id: req.params.id }, {
              $pull: { usersDisliked: req.auth.userId },
              $inc: { dislikes: 1 },
            });
            return res.status(200).json({ message: 'Dislike retiré' });
          }
          return res.status(400).json({ message: 'User has not liked or disliked this sauce' });
        default:
          return res.status(400).json({ message: 'Invalid like value' });
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  };