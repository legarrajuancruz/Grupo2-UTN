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

hbs.registerHelper("eq", function (val1, val2, options) {
  return val1 === val2 ? options.fn(this) : options.inverse(this);
});

app.get("/personajes", async (req, res) => {
  try {
    const response = await axios.get(
      "https://hp-api.herokuapp.com/api/characters"
    );
    const characters = response.data;
    if (characters) {
      console.log("Personajes cargados con exito");
      res
        .status(200)
        .render("personajes", { layout: "layouts/main", characters });
    }
  } catch (error) {
    console.error("Error al obtener los personajes");
    res.status(500).send("Error al leer los personajes");
  }
});

app.get("/game_api", async (req, res) => {
  try {
    const response = await axios.get(
      "https://thronesapi.com/api/v2/Characters"
    );
    const characters = response.data;
    res.render("character", {
      layout: "layouts/main",
      characters,
    });
  } catch (error) {
    console.error("Error en la api", error);
  }
});

app.get("/game_person/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  try {
    const response = await axios.get(
      `https://thronesapi.com/api/v2/Characters/${id}`
    );
    const person = response.data;
    console.log(person);
    res.render("person", {
      layout: "layouts/main",
      person,
    });
  } catch (error) {
    console.error("Error en la api", error);
  }
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render("error404", { title: "Página no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
