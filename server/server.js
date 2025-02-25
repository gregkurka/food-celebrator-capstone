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
  createComment,
  createLike,
  deleteComment,
  deleteLike,
  linkCommentPictureAndUser,
  linkLikePictureAndUser,
  fetchAllLinkCommentPictureAndUser,
  fetchAllLinkLikePictureAndUser,
  fetchUserPicturesByUsername,
  fetchPictureById,
  fetchPictureByUsernameAndId,
} = require("./db");

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
app.use(express.json());
const upload = multer();

//google vision imports
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const visionClient = new ImageAnnotatorClient();
const ALLOWED_LABELS = require("./allowedLabels");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow Render frontend
    credentials: true,
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

app.get("/api/pictures/:pictureId", async (req, res, next) => {
  try {
    res.send(await fetchPictureById(req.params.pictureId));
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

app.get("/api/username/:username/pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPicturesByUsername(req.params.username));
  } catch (ex) {
    next(ex);
  }
});

app.get(
  "/api/username/:username/pictures/:pictureid",
  async (req, res, next) => {
    try {
      res.send(
        await fetchPictureByUsernameAndId({
          username: req.params.username,
          picture_id: req.params.pictureid,
        })
      );
    } catch (ex) {
      next(ex);
    }
  }
);

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

//--Ingur image upload--

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  // We'll collect logs here instead of console.log
  const messages = [];

  try {
    // 1) Ensure a file was provided
    if (!req.file) {
      messages.push("No image provided.");
      return res.status(400).json({
        error: "No image provided",
        logs: messages,
      });
    }

    // 2) Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      messages.push("Unauthorized: No token provided.");
      return res.status(401).json({
        error: "Unauthorized: No token provided",
        logs: messages,
      });
    }

    // 3) Find user by token
    let user;
    try {
      user = await findUserByToken(token);
    } catch (err) {
      messages.push("Unauthorized: Invalid token.");
      return res.status(401).json({
        error: "Unauthorized: Invalid token",
        logs: messages,
      });
    }

    // 4) Face Detection: Reject if any face is detected
    const [faceResult] = await visionClient.faceDetection(req.file.buffer);
    if (faceResult.faceAnnotations && faceResult.faceAnnotations.length > 0) {
      messages.push("Face detected, rejecting image.");
      return res.status(400).json({
        error: "This image contains a person (face detected).",
        logs: messages,
      });
    }

    // 5) Object Localization: Reject if any 'person' object is detected
    const [objectResult] = await visionClient.objectLocalization(
      req.file.buffer
    );
    const personDetected = objectResult.localizedObjectAnnotations.some(
      (obj) => obj.name.toLowerCase() === "person"
    );
    if (personDetected) {
      messages.push("Person object detected, rejecting image.");
      return res.status(400).json({
        error: "This image contains a person (object detected).",
        logs: messages,
      });
    }

    // 6) Label Detection: Check for allowed food-related labels
    const [visionResult] = await visionClient.labelDetection(req.file.buffer);

    // Extract labels with confidence score filtering (0.80+)
    const MIN_CONFIDENCE = 0.8;
    const detectedLabels = visionResult.labelAnnotations
      .filter((label) => label.score >= MIN_CONFIDENCE)
      .map((label) => label.description.toLowerCase());

    // For each label, determine if it is allowed or not and push a log
    detectedLabels.forEach((label) => {
      const isAllowed = ALLOWED_LABELS.some((allowed) =>
        label.includes(allowed)
      );
      messages.push(
        `Detected label: "${label}" - ${isAllowed ? "PASSED" : "REJECTED"}`
      );
    });

    // Count how many detected labels match our allowed list
    const allowedMatches = detectedLabels.filter((label) =>
      ALLOWED_LABELS.some((allowed) => label.includes(allowed))
    );

    // Calculate ratio of allowed labels to total detected labels
    const ratio = allowedMatches.length / (detectedLabels.length || 1);

    // Stricter check: require at least 60% of high-confidence labels be allowed
    // and at least 2 allowed labels overall.
    if (ratio < 0.6 || allowedMatches.length < 2) {
      messages.push(
        `Upload rejected. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
          allowedMatches.length
        }`
      );
      return res.status(400).json({
        error: "This image contains disallowed items.",
        logs: messages,
      });
    }

    messages.push(
      `Upload accepted. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
        allowedMatches.length
      }`
    );

    // 7) Convert the image buffer to a base64 string
    const base64Image = req.file.buffer.toString("base64");

    // 8) Upload the image to Imgur
    const imgurResponse = await axios.post(
      "https://api.imgur.com/3/image",
      { image: base64Image, type: "base64" },
      {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_ACCESS_TOKEN}`,
        },
      }
    );

    const imageUrl = imgurResponse.data.data.link;

    // 9) Create a picture in the database using the returned URL and caption
    const caption = req.body.caption || "";
    const newPicture = await createPicture({ URL: imageUrl, caption });

    // 10) Link the picture to the authenticated user
    await linkUserToPicture({ user_id: user.id, picture_id: newPicture.id });

    // 11) Respond with success, including logs
    return res.status(201).json({
      message: "Upload successful",
      picture: newPicture,
      logs: messages,
    });
  } catch (err) {
    // If something unexpected happens, log it and return a server error
    messages.push(`Unexpected error: ${err.message}`);
    return next({
      status: 500,
      message: "Internal server error",
      logs: messages,
    });
  }
});

// Create a comment on a picture
app.post("/api/createComment", async (req, res, next) => {
  try {
    const { user_id, picture_id, content } = req.body;
    const newComment = await createComment({ content });
    await linkCommentPictureAndUser({
      user_id,
      picture_id,
      comment_id: newComment.id,
    });
    res.status(201).json({ message: "Comment created", comment: newComment });
  } catch (ex) {
    next(ex);
  }
});
// Edit a comment
app.put("/api/editComment", async (req, res, next) => {
  try {
    const { comment_id, content } = req.body;
    const SQL = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *;`;
    const response = await client.query(SQL, [content, comment_id]);
    res.json(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});
// Delete a comment
app.delete("/api/deleteComment", async (req, res, next) => {
  try {
    const { comment_id } = req.body;
    res.json(await deleteComment(comment_id));
  } catch (ex) {
    next(ex);
  }
});
// Create a like on a picture
app.post("/api/createLike", async (req, res, next) => {
  try {
    const { user_id, picture_id } = req.body;
    const newLike = await createLike();
    await linkLikePictureAndUser({
      user_id,
      picture_id,
      like_id: newLike.id,
    });
    res.status(201).json({ message: "Like added", like: newLike });
  } catch (ex) {
    next(ex);
  }
});
// Delete a like
app.delete("/api/deleteLike", async (req, res, next) => {
  try {
    const { like_id } = req.body;
    res.json(await deleteLike(like_id));
  } catch (ex) {
    next(ex);
  }
});
// Fetch all likes on a picture
app.get("/api/:pictureId/likes", async (req, res, next) => {
  try {
    const pictureId = req.params.pictureId;
    const SQL = `
      SELECT 
        users.id AS user_id, 
        users.username, 
        likes_x_pictures_x_users.like_id,
        likes_x_pictures_x_users.created_at
      FROM likes_x_pictures_x_users
      JOIN users ON likes_x_pictures_x_users.user_id = users.id
      WHERE picture_id = $1;
`;
    const response = await client.query(SQL, [pictureId]);
    res.json(response.rows);
  } catch (ex) {
    next(ex);
  }
});
// Fetch all comments on a picture
app.get("/api/:pictureId/comments", async (req, res, next) => {
  try {
    const pictureId = req.params.pictureId;
    const SQL = `
        SELECT users.id AS user_id, 
        users.username, 
        comments.content, 
        comments_x_pictures_x_users.comment_id,
        comments_x_pictures_x_users.created_at
        FROM comments_x_pictures_x_users
        JOIN comments ON comments_x_pictures_x_users.comment_id = comments.id
        JOIN users ON comments_x_pictures_x_users.user_id = users.id
        WHERE picture_id = $1;
      `;
    const response = await client.query(SQL, [pictureId]);
    res.json(response.rows);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect(); // Ensure database is connected
    console.log("Connected to PostgreSQL");

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

init();
