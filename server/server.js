const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");

const { client, createTables } = require("./db");

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

const init = async () => {
  await client.connect();
  await createTables();
};

init();
