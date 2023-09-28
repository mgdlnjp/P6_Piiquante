const Sauce = require("../models/sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauce({
    //propriété de la nouvelle sauce
    ...saucesObject,
    //chemin d'ajout d'une nouvelle image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    //ajout du Like et Dislike
    likes: 0,
    dislikes: 0,
    usersLiked: [" "],
    usersdisLiked: [" "],
  });

  //condition au moment de l'ajout
  sauces
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find() //recuperation des données sauces
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //recuperation des données d'une sauce par l'id
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauces = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        //seul l'utilisateur de la sauce peut la modifier
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id } //update de toute les propriétes de la sauce sélectionnée par l'id
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //chemin du chemin de l'image
          Sauce.deleteOne({ _id: req.params.id }) //supp des propriétés de la sauce
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.likeSauces = (req, res, next) => {
  console.log(req.body.like);
  console.log(req.body);
  console.log(req.params);

  let likeSauces = req.body.like;
  let idSauce = req.params.id;
  let idUser = req.body.userId;

  switch (
    likeSauces //condition du like et dislike
  ) {
    case +1:
      console.log("tu as liké");
      Sauce.updateOne(
        { _id: idSauce },
        { $inc: { likes: +1 }, $push: { usersLiked: idUser } } //update supplementaire du like chez l'utilisateur
      )
        .then(() => res.status(200).json({ message: "Sauce likée!" }))
        .catch((error) => res.status(401).json({ error }));
      break;

    case -1:
      console.log("tu as disliké");
      Sauce.updateOne(
        { _id: idSauce },
        { $inc: { dislikes: +1 }, $push: { usersDisliked: idUser } } //update supplementaire du dislike chez l'utilisateur
      )
        .then(() => res.status(200).json({ message: "Sauce dislikée!" }))
        .catch((error) => res.status(401).json({ error }));
      break;

    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauces) => {
          if (sauces.usersLiked.includes(idUser)) {
            Sauce.updateOne(
              { _id: idSauce },
              { $inc: { likes: -1 }, $pull: { usersLiked: idUser } } //update en cas de retrait du like chez l'utilisateur
            )
              .then(() => res.status(200).json({ message: "Sauce likée!" }))
              .catch((error) => res.status(401).json({ error }));
          }
          if (sauces.usersDisliked.includes(idUser)) {
            Sauce.updateOne(
              { _id: idSauce },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: idUser } } //update en cas de retrait du dislike chez l'utilisateur
            )
              .then(() => res.status(200).json({ message: "Sauce dislikée!" }))
              .catch((error) => res.status(401).json({ error }));
          }
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
      break;
    default:
      console.log("erreur : pas autorisé");
  }
};
