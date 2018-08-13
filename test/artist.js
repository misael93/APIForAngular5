//During the test the env variable is set to test
process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let Artist = require('../models/artist');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Artists', () => {
	beforeEach((done) => { //Before each test we empty the database
		Artist.remove({}, (err) => {
		   done();
		});
	});

 /*
  * Test the /GET route
  */
  describe('/GET artist', () => {
	  it('it should GET all the artists', (done) => {
			chai.request(server)
		    .get('/v1/artists')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });
  });

 /*
  * Test the /POST route
  */
  describe('/POST artist', () => {
	  it('it should not POST an artist without artist name', (done) => {
	  	let artist = {
	  		images:['https://i.ytimg.com/vi/_FrOQC-zEog/hqdefault.jpg'],
        genres:['rock']
	  	}
			chai.request(server)
		    .post('/v1/artists')
		    .send(artist)
		    .end((err, res) => {
			  	res.should.have.status(400);
			  	res.body.should.have.property('error');
		      done();
		    });
	  });
	  it('it should POST an artist ', (done) => {
	  	let artist = {
        name: "Pink Floyd",
        identifier: "pinkfloyd",
        images:['https://i.ytimg.com/vi/_FrOQC-zEog/hqdefault.jpg'],
        genres:['rock']
	  	}
			chai.request(server)
		    .post('/v1/artists')
		    .send(artist)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('message').eql('Artist successfully added!');
			  	res.body.artist.should.have.property('name');
			  	res.body.artist.should.have.property('images');
			  	res.body.artist.should.have.property('genres');
		      done();
		    });
	  });
  });

 /*
  * Test the /GET/:id route
  */
  describe('/GET/:identifier artist', () => {
	  it('it should GET an artist by the given identifier', (done) => {
	  	let artist = new Artist({ name: "Pink Floyd", identifier: "pinkfloyd" });
	  	artist.save((err, artist) => {
	  		chai.request(server)
		    .get('/v1/artists/' + artist.identifier)
		    .send(artist)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.artist.should.have.property('name');
		      done();
		    });
	  	});

	  });
  });
 /*
  * Test the /PUT/:id route
  */
  // describe('/PUT/:id book', () => {
	//   it('it should UPDATE a book given the id', (done) => {
	//   	let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
	//   	book.save((err, book) => {
	// 			chai.request(server)
	// 		    .put('/book/' + book.id)
	// 		    .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
	// 		    .end((err, res) => {
	// 			  	res.should.have.status(200);
	// 			  	res.body.should.be.a('object');
	// 			  	res.body.should.have.property('message').eql('Book updated!');
	// 			  	res.body.book.should.have.property('year').eql(1950);
	// 		      done();
	// 		    });
	// 	  });
	//   });
  // });
 /*
  * Test the /DELETE/:id route
  */
  // describe('/DELETE/:id book', () => {
	//   it('it should DELETE a book given the id', (done) => {
	//   	let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
	//   	book.save((err, book) => {
	// 			chai.request(server)
	// 		    .delete('/book/' + book.id)
	// 		    .end((err, res) => {
	// 			  	res.should.have.status(200);
	// 			  	res.body.should.be.a('object');
	// 			  	res.body.should.have.property('message').eql('Book successfully deleted!');
	// 			  	res.body.result.should.have.property('ok').eql(1);
	// 			  	res.body.result.should.have.property('n').eql(1);
	// 		      done();
	// 		    });
	// 	  });
	//   });
  // });
});
