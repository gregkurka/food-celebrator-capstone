const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { client } = require("./db");

async function findUserByUsername(username) {
  const { rows } = await client.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return rows[0];
}

async function findUserByToken(token) {
  try {
    if (!token) throw new Error("Token required");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await client.query("SELECT * FROM users WHERE id = $1", [
      payload.id,
    ]);

    if (!rows.length) throw new Error("User not found");

    const { password, ...userWithoutPassword } = rows[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error("Invalid token");
  }
}

async function authenticate({ username, password }) {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
}

async function isLoggedIn(req, res, next) {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.headers.authorization;

    if (!token) {
      const error = new Error("No token provided");
      error.status = 401;
      throw error;
    }

    req.user = await findUserByToken(token);
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

module.exports = {
  authenticate,
  findUserByToken,
  isLoggedIn,
};
