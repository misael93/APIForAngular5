var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');

exports.getSongs = function(req, res, next){

    Song.
      find({}).
      populate('_album').
      populate({
        path: '_album',
        select: '_artist images',
        populate: { path: '_artist', select: 'name'}
      }).
      exec(function (err, songs){

          if(err){
              res.send(err);
          }

          res.json(songs)
      });

}

exports.createSong = function(req, res, next){

    var title = req.body.title;
    var images = req.body.images;
    var preview_url = req.body.preview_url;
    var albumId = req.body.albumId;

    if(!title){
        return res.status(400).send({error: 'You must enter a name'});
    }

    if(!albumId){
        return res.status(400).send({error: 'You must enter an album id'});
    }

    Album.findOne({_id:albumId}, function(err, existingAlbum){

        if(err){
            return next(err);
        }

        if(!existingAlbum){
            return res.status(404).send({error: 'Album not found'});
        }


        Song.findOne({title:title}, function(err, existingSong){

          if(err){
            return next(err);
          }

          if(existingSong){
            return res.status(400).send({error: 'That Song is already in our records'});
          }

          var song = new Song({
            title: title,
            images: images,
            preview_url: preview_url,
            _album: existingAlbum._id
          });

          song.save(function(err, song){

            if(err){
              return next(err);
            }

            res.status(201).json({
              song: song
            });
          });
        });
    })


}
