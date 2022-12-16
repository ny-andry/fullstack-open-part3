const mongoose = require("mongoose");

// if no password is given
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Commandline argument
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.nlkhh49.mongodb.net/phonebookApp?retryWrites=true&w=majority
`;

// Person Schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

// Creating a new person
const saveInfo = () => {
  console.log("connected");

  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  });

  return person.save();
};

// print all the persons in the database if only the password is given
const printInfo = () => {
  console.log(`Phonebook:`);
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length < 4) {
  mongoose
    .connect(url)
    .then(() => printInfo())
    .catch((error) => {
      console.log(error);
    });
} else {
  mongoose
    .connect(url)
    .then((result) => saveInfo())
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
