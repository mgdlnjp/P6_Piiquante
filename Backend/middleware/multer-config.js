const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");//destination du dossier d'enregistrement
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const name = file.originalname.split("." + extension).join("_");//methode split pour retirer le ".jpg" et rajouter le callback
    callback(null, name + Date.now() + "." + extension);//personnalisation du nom du fichier par la date de création
  },
});

module.exports = multer({ storage: storage }).single("image");
