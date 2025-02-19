require("dotenv").config();

const { client } = require("./db.js");

const seed = async () => {
  try {
    client.end();
  } catch (error) {
    console.log(error);
  }
};

seed();
