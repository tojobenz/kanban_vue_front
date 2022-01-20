module.exports = app => {
    const cards = require("../controllers/card.controller.js");
  
    var router = require("express").Router();
  
    // Create a new tache
    router.post("/", cards.create);
  
    // Retrieve all cards
    router.get("/", cards.findAll);
  
    // Retrieve all published cards
    router.get("/published", cards.findAllPublished);
  
    // Retrieve a single tache with id
    router.get("/:id", cards.findOne);
  
    // Update a tache with id
    router.put("/:id", cards.update);
  
    // Delete a tache with id
    router.delete("/:id", cards.delete);
  
    // Create a new tache
    router.delete("/", cards.deleteAll);
  
    app.use("/api/cards", router);
  };
  