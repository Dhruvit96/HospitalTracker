const multer = require("multer");
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "public/images/"),
    filename: function (_req, file, cb) {
        let filename = file.originalname.split(".");
        cb(null, Date.now() + "." + filename[1]);
    },
});

module.exports = multer({
    storage: storage,
});