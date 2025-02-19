require("dotenv").config();
const {
  client,
  createTables,
  createUser,
  createPicture,
  linkUserToPicture,
  fetchUsers,
  fetchPictures,
  fetchUserPictures,
  deleteUser,
  deletePicture,
  deleteUserPictureLink,
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.post("/api/users", async (req, res, next) => {
  try {
    res.status(201).send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/pictures", async (req, res, next) => {
  try {
    res.status(201).send(await createPicture(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:userId/pictures/:pictureId", async (req, res, next) => {
  try {
    res.status(201).send(
      await linkUserToPicture({
        user_id: req.params.userId,
        picture_id: req.params.pictureId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/pictures", async (req, res, next) => {
  try {
    res.send(await fetchPictures());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:userId/pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPictures(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:id", async (req, res, next) => {
  try {
    res.send(await deleteUser(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/pictures/:id", async (req, res, next) => {
  try {
    res.send(await deletePicture(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:userId/pictures/:pictureId", async (req, res, next) => {
  try {
    res.send(
      await deleteUserPictureLink({
        user_id: req.params.userId,
        picture_id: req.params.pictureId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({ error: err.message || err });
});

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database.");

    await createTables();
    console.log("Tables created.");

    const user1 = await createUser({
      username: "testuser1",
      password: "password1",
      email: "test1@example.com",
    });
    const user2 = await createUser({
      username: "testuser2",
      password: "password2",
      email: "test2@example.com",
    });

    const picture1 = await createPicture({
      URL: "https://example.com/image1.jpg",
      caption: "A beautiful sunset.",
    });
    const picture2 = await createPicture({
      URL: "https://example.com/image2.jpg",
      caption: "A mountain view.",
    });

    await linkUserToPicture({ user_id: user1.id, picture_id: picture1.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture2.id });

    console.log("Data seeded.");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.error("Init function failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  }
};

init();
