// setup.. this is similar to when we use our default tags in html

const express = require("express");
// We have to use cors in order to host a front end and backend on the same device
var cors = require("cors");
// activate or tell this app variable to be an express server
const app = express();
const router = express.Router();

const Song = require("./models/songs");

app.use(cors());
app.use(express.json());

// grab all the songs in a database
router.get("/songs", async function (req, res) {
  let query = {};

  if (req.query.genre) {
    query = { genre: req.query.genre };
  }

  // to find all songs in a database you just use the find() method that is built into mongoose
  try {
    const songs = await Song.find(query);
    res.json(songs);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/songs", async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
    console.log(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/songs/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (err) {
    res.status(400).send(err);
  }
});

// update is to update an existing record/resource/database entry.. it uses a PUT request
// You actually do need the full api path "/songs/:id" to handle the PUT operation.
// There's a chance that there may be some short cut that was not uncovered during the tutorial
// But the safest options is to include the full path.
router.put("/songs/:id", async (req, res) => {
  // first we need to find and update the song the front end wants us to update.
  // to do this we need to request the id of the song from the request
  // and then find it in the database and update it.
  try {
    const song = req.body;
    await Song.updateOne({ _id: req.params.id }, song);
    console.log(song);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

// DELETE  a song by using a .delete request. We're going to set the const to deletedSong to clarify intent.
// we use the method .findByIdAndDelete(req.params.id);
// the redirect will be handled on the front end

router.delete("/songs/:id", async function (req, res) {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);

    // We will check for the existence of the deleted song object and return a unique response dependent on the boolean returned.
    if (!deletedSong) {
      return res.status(404).send("Song not found.");
    }

    // If you make it this far than the song was deleted and the object was stored in deletedSong
    res.json({ message: "Song succesfully deleted", song: deletedSong });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use("/api", router);
app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
