const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
require('tracer').setLevel('error');

chai.should();
chai.use(chaiHttp);

describe('UC-201 Registreren als nieuwe user', () => {
  it('TC-201-1-InputMissing', (done) => {
    chai.request(server).post("/api/user?lastName=testlast&street=teststreet&city=testcity&emailAdress=ct@gmail.com&password=wachtwoord&phoneNumber=0612345678").end((err, res) => {
        res.body.should.be.an("object");
        res.body.should.have.keys("status", "message", "data");
        let { data, message, status } = res.body;
        status.should.equal(400)
        message.should.be.a("string").that.contains('"firstName" is required');
        data.should.be.an("object");
        data.should.be.empty;
        done();
    })
  })
  
    it('TC-201-5 - User succesvol geregistreerd', (done) => {
      // Nieuwe gebruiker om te testen
      const newUser = {
        firstName: 'Henk',
        lastName: 'Jan',
        isActive: true,
        emailAdress: 'hj@gmail.com',
        password: 'wachtwoord',
        phoneNumber: '0612345678',
        street: 'Straat',
        city: 'Stad',
      };

      chai
        .request(server)
        .post('/api/user')
        .send(newUser)
        .end((err, res) => {
          assert(err === null);
    
          res.should.have.status(201);
          res.body.should.be.an('object');
    
          let { data, message, status } = res.body;
    
          status.should.equal(201);
          message.should.be.a('string').that.contains('User created');
          data.should.be.an('object');
  
          data.should.have.property('firstName').that.is.a('string').and.equals(newUser.firstName);
          data.should.have.property('lastName').that.is.a('string').and.equals(newUser.lastName);
          data.should.have.property('emailAdress').that.is.a('string').and.equals(newUser.emailAdress);
          data.should.have.property('isActive').that.is.a('boolean').and.equals(newUser.isActive);
          data.should.have.property('street').that.is.a('string').and.equals(newUser.street);
          data.should.have.property('city').that.is.a('string').and.equals(newUser.city);
          data.should.have.property('password').that.is.a('string').and.equals(newUser.password);
          data.should.have.property('phoneNumber').that.is.a('string').and.equals(newUser.phoneNumber);
          done();
        });
    });
  });
  
  describe('UC-202 Opvragen van overzicht van users', () => {
      it('TC-202-1 - Toon alle gebruikers, minimaal 2', (done) => {
        // Voer de test uit
        chai
          .request(server)
          .get('/api/user')
          .end((err, res) => {
            assert(err === null);
    
            res.body.should.be.an('object');
            let { data, message, status } = res.body;
    
            status.should.equal(200);
            message.should.be.a('string').equal('Get all users');
            //expect(res.body.data.length).to.be.gte(2);
    
    
            done();
          });
      });
  
    // Je kunt een test ook tijdelijk skippen om je te focussen op andere testcases.
    // Dan gebruik je it.skip
    it.skip('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
      // Voer de test uit
      chai
        .request(server)
        .get('/api/user')
        .query({ name: 'name', city: 'non-existent' })
        // Is gelijk aan .get('/api/user?name=foo&city=non-existent')
        .end((err, res) => {
          assert(err === null);
  
          res.body.should.be.an('object');
          let { data, message, status } = res.body;
  
          status.should.equal(200);
          message.should.be.a('string').equal('User getAll endpoint');
          data.should.be.an('array');
  
          done();
        });
    });

    describe('UC-204 Opvragen van usergegevens bij ID', () =>{

      it('TC-204-3 Gebruiker-ID bestaat', function(done) {
        const userId = 1;
      
        chai
          .request(server)
          .get(`/api/user/${userId}`)
          .end((err, res) => {
            assert(err === null);
      
            res.body.should.be.an('object');
            let { data, message, status } = res.body;
      
            status.should.equal(200);
            message.should.be.a('string').equal('Found user');
      
            data.should.be.an('object');
            data.should.have.property('firstName').that.is.a('string');
            data.should.have.property('lastName').that.is.a('string');
            data.should.have.property('emailAdress').that.is.a('string');
            data.should.have.property('street').that.is.a('string');
            data.should.have.property('city').that.is.a('string');
            data.should.have.property('password');
            data.should.have.property('phoneNumber');
      
            done();
          });
      });
      
    });
    describe('UC-206 Verwijderen van user', () =>{

      it('TC-206-4 Gebruiker succesvol verwijderd', function(done) {
        const userId = 1;
        chai
          .request(server)
          .delete(`/api/user/${userId}`)
          .end((err, res) => {
            assert(err === null);
      
          res.body.should.be.an('object');
          let { data, message, status } = res.body;
      
            status.should.equal(200);
            message.should.be.a('string').equal('User has been deleted');
            data.should.be.an('array');
            data.should.have.lengthOf(2);
            data.should.not.include({ id: 1 });
      
            done();
          });
      });
    })
  });
