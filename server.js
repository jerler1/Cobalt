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

const options = {
  host: "localhost",
  port: 8080,
  user: "root",
  password: "kitty1",
  database: "cobaltCanvasDB",
};
const sessionOptions = {
  host: "localhost",
  port: 8080,
  user: "root",
  password: "kitty1",
  database: "cobaltCanvasDB",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 1,
  endConnectionOnClose: true,
  charset: "utf8mb4_bin",
  schema: {
    tableName: "sessions",
    columnNames: {
      sessionId: "sessionId",
      expires: "expires",
      data: "data",
    },
  },
};

app.use(session({ secret: "canvas", resave: false, saveUninitialized: false }));
const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore(sessionOptions, connection);

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
