var mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    images: [String],
    genres: [String],
    identifier: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Artist', ArtistSchema);
