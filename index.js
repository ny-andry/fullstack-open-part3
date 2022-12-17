// Import the express and morgan libraries
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

// Create an instance of the express app
const app = express();

// Import the cors library to handle cross-origin requests
const cors = require("cors");

// Use the cors and express.static middleware
app.use(cors());
app.use(express.static("build"));

// Create morgan token
// Define a custom morgan token to log the request body as JSON
morgan.token("postjson", (request) => {
  return JSON.stringify(request.body);
});

// Use the custom morgan token and the express.json middleware
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postjson"
  )
);
app.use(express.json());

// Get time
const now = new Date();

// Http requests REST
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${now}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Cannot find id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
