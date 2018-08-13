var TodoController = require('./controllers/todos'),
    AuthController = require('./controllers/auth'),
    ArtistController = require('./controllers/artist'),
    AlbumController = require('./controllers/album'),
    SongController = require('./controllers/song'),
    express = require('express'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false }),
    requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        artistRoutes = express.Router(),
        albumRoutes = express.Router(),
        songRoutes = express.Router(),
        todoRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', AuthController.login);

    // Todo Routes
    apiRoutes.use('/todos', todoRoutes);
    todoRoutes.get('/:todo_id', TodoController.getTodo);
    todoRoutes.get('/', TodoController.getTodos);
    todoRoutes.post('/', TodoController.createTodo);
    todoRoutes.put('/:todo_id', TodoController.updateTodo);
    todoRoutes.delete('/:todo_id', TodoController.deleteTodo);

    //Artist routes
    apiRoutes.use('/artists', artistRoutes);
    artistRoutes.get('/', ArtistController.getArtists);
    artistRoutes.get('/:identifier', ArtistController.getArtistByIdentifier);
    artistRoutes.post('/', ArtistController.createArtist);
    artistRoutes.put('/:identifier', ArtistController.updateArtist);

    //Album routes
    apiRoutes.use('/albums', albumRoutes);
    albumRoutes.get('/', AlbumController.getAlbums);
    albumRoutes.post('/', AlbumController.createAlbum);

    //Song routes
    apiRoutes.use('/songs', songRoutes);
    songRoutes.get('/', SongController.getSongs);
    songRoutes.post('/', SongController.createSong);

    // Set up routes
    app.use('/v1', apiRoutes);

    //Not found route
    apiRoutes.use((req, res, next) => {
        res.status(404).send("Not found");
    });

    apiRoutes.get('/', (req, res) => {
        res.status(200).send('Basic Api V1');
    })

}
