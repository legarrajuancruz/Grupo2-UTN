const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const axios = require("axios");
const dotenv = require("dotenv");
const hbs = require("hbs");

dotenv.config();

app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/upload"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb("Solo se puede subir imagenes a este repositorio", file);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get("/inicio", (req, res) => {
  res.render("index", {
    layout: "layouts/main",
    title: "Inicio",
    message: "Bienvenidos a nuestra aplicación de carga de archivos",
  });
});

app.get("/upload", (req, res) => {
  res.render("upload-form", {
    layout: "layouts/main",
    title: "Carga de archivos",
    message: "Formulario de carga de archivos.",
  });
});

// Ruta para manejar la carga de archivos (POST)
app.post("/upload", upload.single("file"), (req, res) => {
  console.log(upload);
  res.render("upload-success", {
    title: "Carga Exitosa",
    message: "Archivo cargado exitosamente",
    filename: req.file.filename,
  });
});

// app.get("/movies/populares", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.themoviedb.org/3/movie/popular",
//       {
//         params: {
//           api_key: process.env.TMDB_API_KEY,
//         },
//       }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// });

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render("error404", { title: "Página no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("init");
  // console.log(path.join(__dirname, '/public/upload'));
});
