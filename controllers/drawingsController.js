const express = require("express");
const db = require("../models");

const router = express.Router();

//  VIEW ROUTES

// View all drawings
router.get("/drawings", async (req, res) => {
  try {
    const drawings = await db.Drawing.findAll({ include: db.User });
    res.render("view-all", {
      drawings,
      username: req.session.user && req.session.user.userName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

// Create a new drawing
router.get("/drawing/", async (req, res) => {
  if (req.session && req.session.user) {
    res.render("create-new", {
      user: req.session.user,
      username: req.session.user && req.session.user.userName,
    });
  } else {
    res.redirect("/");
  }
});

// View a single users drawing
router.get("/:user/drawing/:id", async (req, res) => {
  if (req.session && req.session.user) {
    try {
      const drawing = await db.Drawing.findOne({
        where: { id: req.params.id },
      });
      if (drawing != null) {
        const owner = req.session.user.id == drawing.dataValues.UserId;
        res.render("edit-artwork", {
          drawing,
          user: req.session.user,
          owner,
          username: req.session.user && req.session.user.userName,
        });
      } else {
        res.status(404).render("not-found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong!");
    }
  } else {
    res.redirect("/");
  }
});

//  API ROUTES

router.get("/api/drawings", async (req, res) => {
  try {
    const drawings = await db.Drawing.findAll({ include: db.User });
    res.json(drawings);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Couldn't get drawings.",
    });
  }
});

router.get("/api/drawings/:id", async (req, res) => {
  try {
    const drawing = await db.Drawing.findOne({
      where: { id: req.params.id },
      include: db.User,
    });
    res.json(drawing);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Couldn't get drawing.",
    });
  }
});

router.post("/api/drawings", async (req, res) => {
  const { name, link, data, userId } = req.body;
  const newDrawing = {
    name,
    link,
    data,
    UserId: userId,
  };

  try {
    const drawing = await db.Drawing.create(newDrawing);
    // should probably check the result.
    res.status(201).json({
      error: false,
      message: "Drawing created.",
      drawing,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Couldn't create a new drawing.",
    });
  }
});

router.put("/api/drawings/:id", async (req, res) => {
  const { name, link, data, userId } = req.body;
  const updatedDrawing = {
    name,
    link,
    data,
    UserId: userId,
  };

  try {
    const drawing = await db.Drawing.update(updatedDrawing, {
      where: { id: req.params.id },
    });
    res.json({
      error: false,
      message: "Drawing updated.",
      drawing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Couldn't update the drawing.",
    });
  }
});

router.delete("/api/drawings/:id", async (req, res) => {
  try {
    const result = await db.Drawing.destroy({ where: { id: req.params.id } });
    res.json({
      error: false,
      message: "Ok",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Couldn't delete the drawing.",
    });
  }
});

module.exports = router;
