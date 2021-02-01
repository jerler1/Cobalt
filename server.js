require('dotenv').config()
const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const mysql = require("mysql");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const app = express();
const db = require("./models");
const usersController = require("./controllers/usersController");
const drawingsController = require("./controllers/drawingsController");

// Session variables.
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

app.use(session({ secret: "canvas", resave: false, saveUninitialized: false }));

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(handlebars),
  })
);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/config", (req, res) => {
  res.json({
    success: true,
  });
});

app.use(usersController);
app.use(drawingsController);

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
