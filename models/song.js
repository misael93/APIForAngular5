var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    preview_url: String,
    images: [
      {
        url:String
      }
    ],
    _album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album'}
}, {
    timestamps: true
});

module.exports = mongoose.model('Song', SongSchema);
