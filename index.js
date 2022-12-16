// Import the express and morgan libraries
const express = require("express");
const morgan = require("morgan");

// Create an instance of the express app
const app = express();

// Import the cors library to handle cross-origin requests
const cors = require("cors");

// Use the cors and express.static middleware
app.use(cors());
app.use(express.static("build"));

// A middleware is a function that is executed on
//  incoming requests to an application before the request is passed on to the route handler.

// app.use(morgan("tiny"));

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Get time
const now = new Date();

// Http requests REST
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${now}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((x) => x.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((x) => x.id !== id);

  response.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 1000000) + 1;

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number missing",
    });
  } else if (persons.find((x) => x.name === body.name)) {
    return response.status(400).json({
      error: "Name already exist",
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
