const express = require('express');
const db = require('../models');

const router = express.Router();

//  VIEW ROUTES

router.get('/drawings', async (req, res) => {
  try {
    const drawings = await db.Drawing.findAll({ include: db.User });
    res.render('view-all', { drawings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

router.get('/drawings/new', async (req, res) => {
  res.render('create-new');
});

router.get('/drawings/:id/edit', async (req, res) => {
  try {
    const drawing = await db.Drawing.findOne({ where: { id: req.params.id } });
    res.render('edit-artwork', { drawing });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

//  API ROUTES

router.get('/api/drawings', async (req, res) => {
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

router.get('/api/drawings/:id', async (req, res) => {
  try {
    const drawing = await db.Drawing.findOne({ where: { id: req.params.id }, include: db.User });
    res.json(drawing);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: "Couldn't get drawing.",
    });
  }
});

router.post('/api/drawings', async (req, res) => {
  const { name, link, user_id } = req.body;
  const newDrawing = {
    name,
    link,
    user_id,
  };

  try {
    const result = await db.Drawing.create(newDrawing);
    // should probably check the result.
    res.json({
      status: 'ok',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Couldn't create a new drawing.",
    });
  }
});

router.post('/api/drawings/:id', async (req, res) => {
  // does this route make sense to include?
});

router.delete('/api/drawings/:id', async (req, res) => {
  try {
    const result = await db.Drawing.destroy({ where: { id: req.params.id } });
    res.json({
      error: false,
      message: 'Ok',
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
