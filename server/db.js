const pg = require("pg");
const client = new pg.Client();
const uuid = require("uuid");
const bcrypt = require("bcrypt");

//replace with real table data
const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS users_x_pictures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pictures;

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Required for gen_random_uuid()

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pictures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    URL VARCHAR(2083) NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_x_pictures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    picture_id UUID NOT NULL REFERENCES pictures(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, picture_id) -- Prevents duplicate relations
);


    `;
  await client.query(SQL);
};

module.exports = {
  client,
  createTables,
};
