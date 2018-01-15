const express = require('express');
const router = express.Router();
const companyStore = require('json-fs-store')('store/companies')

router.get('/', (req, res) => {
    companyStore.list((err, companies) => {
        if (err) throw err;

        const factories = companies.filter(c => (c.company_type === "factory"))
        res.json(factories);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q
    companyStore.list((err, companies) => {
        if (err) throw err;

        const factory = companies.find(c => (
            c.company_type === "factory" && c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))

        if (!factory) return res.sendStatus(404)
        res.json(factory);
    });
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, company) => {
        if (err) throw err;
        res.json(company);
    });
});

router.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const newFactory = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: "factory"
    };
    companyStore.add(newFactory, err => {
        if (err) throw err;
        res.json(newFactory);
    });
});

module.exports = router;
