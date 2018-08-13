var Artist = require('../models/artist');

exports.getArtists = (req, res, next) => {

  Artist.find((err, artists) => {

    if (err) {
      res.send(err);
    }

    return res.status(200).send(artists);

  });

}

exports.createArtist = (req, res, next) => {

  var name = req.body.name;
  var images = req.body.images;
  var genres = req.body.genres;

  if (!name) {
    return res.status(400).send({ error: 'You must enter a name' });
  }

  var artist = new Artist({
    name: name,
    images: images,
    genres: genres,
    identifier: toLowerCase(removeWhiteSpace(removeSpecialCharecters(name)))
  });

  Artist.findOne({ identifier: artist.identifier }, (err, _artist) => {
    if (err) {
      return next(err);
    }

    if (_artist) {
      return res.status(409).send({ error: 'That artist is already in our records' });
    }

    artist.save((err, artist) => {

      if (err) {
        return next(err);
      }

      return res.status(200).json({
        message: "Artist successfully added!",
        artist: artist
      });

    });

  });

}

exports.getArtistByIdentifier = (req, res, next) => {

  var identifier = req.params.identifier;

  if (!identifier) {
    return res.status(400).send({ error: 'You must enter an identifier' });
  }

  Artist.findOne({ identifier: identifier }, (err, artist) => {

    if (err) {
      return next(err);
    }

    if (!artist || artist == null) {
      return res.status(404).json({
        error: "Artist not found"
      });
    }

    return res.status(200).json({
      artist: artist
    });

  });
}

exports.updateArtist = (req, res, next) => {

  var identifier = req.params.identifier;
  var name = req.body.name;
  var images = req.body.images;
  var genres = req.body.genres;

  if (!identifier) {
    return res.status(400).send({ error: "You must enter an identifier" });
  }

  if (!name) {
    return res.status(400).send({ error: "You must enter a name" });
  }

  var newIdentifier = toLowerCase(removeWhiteSpace(removeSpecialCharecters(name)));

  Artist.findOne(
    {
      $and: [
        { identifier: { $ne: identifier } },
        { identifier: newIdentifier }
      ]
    },
    (err, artist) => {

      if (err) {
        return res.status(400).send(err);
      }

      if (artist) {
        return res.status(409).send({ error: "This artist is already in our records" });
      }

      Artist.findOneAndUpdate({ identifier: identifier },
        {
          identifier: newIdentifier,
          name: name,
          images: images,
          genres: genres
        },
        { new: true, runValidators: true },
        (err, artist) => {

          if (err) {
            return res.status(400).send(err);
          }

          if (!artist) {
            return res.status(404).send({ error: "Artist not found" });
          }

          return res.status(200).json({
			message: "Artist successfully updated",
            artist: artist
          });

        });

    }
  );

}


exports.deleteArtist = (req, res, next) => {

  Artist.remove({
    _id: req.params.artist_id
  }, function (err, artist) {
    res.json(artist);
  });

}

exports.deleteAll = (req, res, next) => {

  Artist.remove({}, (err) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      message: "Success"
    });

  });

}

function removeSpecialCharecters(string) {
  return string.replace(/[^\w\s]/gi, '');
}

function removeWhiteSpace(string) {
  return string.replace(/ /g, '');
}

function toLowerCase(string) {
  return string.toLowerCase();
}
