require("dotenv").config();
const cors = require("cors");
const imgur = require("imgur");
const multer = require("multer");
const axios = require("axios");

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
  fetchUserPictureLinks,
  fetchFeed,
} = require("./db");

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
app.use(express.json());
const upload = multer();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only the frontend origin
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

app.use(cors());

const path = require("path");

const { authenticate, findUserByToken, isLoggedIn } = require("./auth");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).send(newUser);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    const user = await findUserByToken(req.headers.authorization);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
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

app.get("/api/users_x_pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPictureLinks());
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

app.get("/api/feed", async (req, res, next) => {
  try {
    res.send(await fetchFeed());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  try {
    // Ensure a file was provided
    if (!req.file) {
      return res.status(400).send({ error: "No image provided" });
    }
    // Convert the image Buffer to a base64 string
    const base64Image = req.file.buffer.toString("base64");
    // Upload the image to Imgur
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      {
        image: base64Image,
        type: "base64",
      },
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_ACCESS_TOKEN}`,
        },
      }
    );
    // Extract the URL from the Imgur response
    const imageUrl = response.data.data.link;
    // Optionally, you can save the imageUrl to your database
    // For example, using your createPicture function:
    // const newPicture = await createPicture({ URL: imageUrl, caption: req.body.caption });
    // res.status(201).send(newPicture);
    res.status(201).send({ imageUrl });
  } catch (err) {
    next(err);
  }
});

//--Ingur image upload--

//--THIS DOES NOT WORK AT THIS TIME--
// app.post("/api/upload", upload.single("image"), async (req, res, next) => {
//   try {
//     // Ensure a file was provided
//     if (!req.file) {
//       return res.status(400).send({ error: "No image provided" });
//     }
//     // Convert the image Buffer to a base64 string
//     const base64Image = req.file.buffer.toString("base64");
//     // Upload the image to Imgur using OAuth authentication
//     const response = await axios.post(
//       "https://api.imgur.com/3/image",
//       {
//         image: base64Image,
//         type: "base64",
//       },
//       {
//         headers: {
//           // Use Bearer token for OAuth authentication
//           Authorization: `Bearer ${process.env.IMGUR_SECRET}`,
//         },
//       }
//     );
//     // Extract the URL from the Imgur response
//     const imageUrl = response.data.data.link;
//     // Optionally, save the imageUrl to your database (e.g., using createPicture)
//     // const newPicture = await createPicture({ URL: imageUrl, caption: req.body.caption });
//     // res.status(201).send(newPicture);
//     res.status(201).send({ imageUrl });
//   } catch (err) {
//     next(err);
//   }
// });

const init = async () => {
  try {
    await client.connect();
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.error("Init function failed:", err);
    process.exit(1);
  }
};

init();
