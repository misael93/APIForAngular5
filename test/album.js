//During the test the env variable is set to test
process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let Album = require('../models/artist');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Albums', () => {
	beforeEach((done) => {
		Album.remove({}, (err) => {
		   done();
		});
	});

  describe('/GET albums', () => {
	  it('it should GET all the albums', (done) => {
			chai.request(server)
		    .get('/v1/albums')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });
  });

});
