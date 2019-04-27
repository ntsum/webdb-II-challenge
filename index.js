const express = require("express");

const helmet = require("helmet");

const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const server = express();

const db = knex(knexConfig);

server.use(express.json());
server.use(helmet());

// endpoints here
server.post("/api/bears", (req, res) => {
  db("bears")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("bears")
        .where({ id })
        .first()
        .then(bear => {
          res.status(201).json(bear);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/bears", (req, res) => {
  //returns a promise that resolves all records in the table
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/bears/:id", (req, res) => {
  const roleId = req.params.id;
  db("bears")
    .where({ id: roleId })
    .first()
    .then(bear => {
      res.status(200).json(bear);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.put("/api/bears/:id", function(req, res) {
  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "record not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.delete("/apis/bears/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(404).end();
      } else {
        res.status(404).json({ message: "record not found" });
      }
    });
});

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
