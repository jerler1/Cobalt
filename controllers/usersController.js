const express = require("express");
const db = require("../models");

const router = express.Router();

//  VIEW ROUTES

router.get("/users", async (req, res) => {
  console.log(req.session.user);
  try {
    const users = await db.User.findAll();
    res.render("all-users", { users, username: req.session.user && req.session.user.userName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/users/:name", async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { userName: req.params.name },
      include: db.Drawing,
    });
    if (user != null) {
      res.render("single-artist", { user });
    } else {
      res.status(404).render("not-found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

//  API ROUTES

router.get("/api/users", async (req, res) => {
  try {
    const users = await db.User.findAll({ include: db.Drawing });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Couldn't get users.",
    });
  }
});

router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.params.id },
      include: db.Drawing,
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Couldn't get user.",
    });
  }
});

router.post("/api/users", async (req, res) => {
  console.log(req.session);
  const { userName } = req.body;
  const newUser = {
    userName,
  };

  try {
    const user = await db.User.create(newUser);
    req.session.user = user;
    console.log(req.session.user);
    // should probably check the result.
    res.status(201).json({
      error: false,
      message: "User created.",
      user,
    });
  } catch (error) {
    console.error(error);
    if (error.original.code === "ER_DUP_ENTRY") {
      res.status(400).json({
        error: true,
        message: "That username is already taken.",
      });
    } else {
      res.status(500).json({
        error: true,
        message: "Couldn't create a new user.",
      });
    }
  }
});

router.put("/api/users/:id", async (req, res) => {
  // update the user
  // Do we actually need this???
});

router.delete("/api/users/:id", async (req, res) => {
  try {
    const result = await db.User.destroy({ where: { id: req.params.id } });
    res.json({
      error: false,
      message: "ok",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Couldn't delete user.",
    });
  }
});

//  OTHER ROUTES
router.post("/login", async (req, res) => {
  const { userName } = req.body;

  const user = await db.User.findOne({ where: { userName } });

  if (user != null) {
    // setUp the user sessions and redirect to their page.
    req.session.user = user;
    res.redirect(`/users/${userName}`);
  } else {
    // couldn't find that username so send back a 400? status
    res.status(400).json({
      error: true,
      message: "Couldn't find that username.",
    });
  }
});

module.exports = router;
