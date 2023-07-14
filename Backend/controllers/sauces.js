const Sauce = require('../models/sauces');
const fs = require ('fs') 



exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  //delete saucesObject._userId;
  const sauces = new Sauce({
      ...saucesObject,
      //userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [" "],
      usersdisLiked: [" "],
  });

  sauces.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getAllSauces = (req, res, next) => {
    //console.log("toto")
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.modifySauces = (req, res, next) => {
     const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  
  //delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
  };
  
  exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
     .catch( error => {
        res.status(500).json({ error });
    }); 
  };

  exports.likeSauces = (req, res, next) => {
    console.log(req.body.like);
    console.log(req.body);
    console.log(req.params);

    let likesauce = req.body.like;
    let iduser = req.body.userId;
    let idsauce = req.params.id;
    //let sauceId = sauce.userId;


    switch(likesauce){
      case 1:
        console.log("tu as liké");
        Sauce.updateOne({ _id: idsauce}, {$push: {usersLiked: {iduser}}})
              .then(() => res.status(200).json({message : 'Sauce likée!'}))
              .catch(error => res.status(401).json({ error }));
        break;
        case -1:
          console.log ("tu as pas disliké");
          break;


        case 0:

          break;
          default:
            console.log("erreur pas autorisé");
    }
    
/*     Sauce.findOne({ _id: req.params.id })
.then((sauce) =>{
  if (sauce.userId != req.auth.userId) {
    return Promise.reject("Unauthorized");
  }

}
) */
    


  }