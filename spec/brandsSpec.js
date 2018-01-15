const request = require('supertest');

describe('Brands', () => {
    let app;
    beforeEach(() => {
        app = require('../app.js');
    });
    afterEach(() => {
        app.close();
    });

    it('gets all brands', done => {
        request(app)
            .get('/brands')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.length).toBeGreaterThan(0);
                done(res);
            });
    });

    it('gets a single brand', done => {
        request(app)
            .get('/brands/0a75d3f4-c8ff-47bb-84c3-a874007d1b4f') // admittedly, this is an ugly id.
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('creates a new brand', done => {
        request(app)
            .post('/brands')
            .send({
              name: 'Test Brand',
              email: 'test data',
              phone_number: 'test data',
              city: 'test data',
              state: 'test data'
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body.name).toEqual('Test Brand');

                done(res);
            });
    });

    it('finds an existing brand', done => {
        request(app)
            .get('/brands/search?q=Brand One')
            .expect(200)
            .end((err, res) => {
                if (err) return done.fail(err);
                expect(res.body).not.toBeNull();
                done(res);
            });
    });

    it('returns 404 when it can\'t find a brand', done => {
        request(app)
            .get('/brands/search?q=foo bar')
            .expect(404)
            .end((err, res) => {
                if (err) return done.fail(err);
                done(res);
            });
    });
});
