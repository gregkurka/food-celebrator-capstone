const pg = require("pg");
const client = new pg.Client();
const uuid = require("uuid");
const bcrypt = require("bcrypt");

//replace with real table data
const createTables = async () => {
  const SQL = `
      DROP TABLE IF EXISTS favorite;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS products;
  
      CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(64) NOT NULL UNIQUE,
        password VARCHAR(256) NOT NULL
      );
  
      CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(64) NOT NULL
      );
  
      CREATE TABLE favorite(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) NOT NULL,
        CONSTRAINT unique_user_favorite UNIQUE (user_id, product_id)
      );
    `;
  await client.query(SQL);
};

module.exports = {
  client,
};
