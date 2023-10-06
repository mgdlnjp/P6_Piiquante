const multer = require("multer");

const MIME_TYPES = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); //destination du dossier d'enregistrement
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype]; //extension souhaitée pour l'image finale
    const originalname = file.originalname;
    const sansExtension = originalname.split(".").slice(0, -1).join("."); //suppression de l'extension
    callback(null, sansExtension + "_" + Date.now() + "." + extension); //personnalisation du nom du fichier par la date de création
  },
});

module.exports = multer({ storage: storage }).single("image");
