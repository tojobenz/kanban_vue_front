const db = require("../models/card");
const Card = db.cards;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const card = new Card({
    name: req.body.name,
    headerColor: "#607d8b",
    items: [],
  });

  // Save Tutorial in the database
  card
    .save(card)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the card."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const titre = req.query.titre;
  var condition = titre ? { titre: { $regex: new RegExp(titre), $options: "i" } } : {};

  Card.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cards."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Card.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Card with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Card with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Card.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Card with id=${id}. Maybe Card was not found!`
        });
      } else res.send({ message: "Card was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Card with id=" + id
      });
    });
};

// Delete a Card with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Card.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Card with id=${id}. Maybe Card was not found!`
        });
      } else {
        res.send({
          message: "Card was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Card with id=" + id
      });
    });
};

// Delete all cards from the database.
exports.deleteAll = (req, res) => {
  Card.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} cards were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cards."
      });
    });
};

// Find all published cards
exports.findAllPublished = (req, res) => {
  Card.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cards."
      });
    });
};
