const express = require("express");
const db = require("../models");

const router = express.Router();

/**
 * Route to render all art to a page. 
 */
router.get("/art", (req, res) => {
  db.Art.findAll()
    .then((viewAll) => {
      res.render("viewAll", { art: viewAll });
    })
    .catch((err) => {
      console.log(err);
      //TODO: render 404 page if we're unable to return art
      res.status(500).end();
    });
});

/**
 * Route to render the new art.
 */
router.get("/art/new", (req, res) => {
  res.render("create-new");
});

/**
 * Route to pull art data from the database
 * Render the art data to a canvas.
 */
router.get("/art/:id/edit", (req, res) => {
  db.Art.findOne({ where: { id: req.params.id } })
    .then((singleArt) => {
      res.render("edit-art", singleArt.dataValues);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).end();
    });
});

/**
 * Display information about a single artist.
 */
router.get("/art/:id", (req, res) => {
  db.Art.findOne({
    where: { id: req.params.id },
  })
    .then((singleArt) => {
      // console.log(singleArt.dataValues);
      res.render("single-artist", singleArt.dataValues);
    })
    .catch((err) => {
      res.status(500).end();
    });
});

/**
 * API Route to create new art.
 */
router.post("/api/art", (req, res) => {
  db.Art.create(req.body)
    .then((createdArt) => {
      res.json(createdArt);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

/**
 * API Route to update existing art by ID
 */
router.put("/api/art/:id", (req, res) => {
  db.Art.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).end();
    });
});

/**
 * API Route to delete art by ID
 */
router.delete("/api/art/:id", (req, res) => {
  db.Art.delete({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).end();
    });
});

module.exports = router;
