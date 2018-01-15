const express = require('express');
const router = express.Router();
const companyStore = require('json-fs-store')('store/companies')

router.get('/', (req, res) => {
    companyStore.list((err, companies) => {
        if (err) throw err;
        const brands = companies.filter(c => (c.company_type === "brand"))
        res.json(brands);
    });
});

router.get('/search', (req, res) => {
    const searchQuery = req.query.q
    companyStore.list((err, companies) => {
        if (err) throw err;

        const brand = companies.find(c => (
            c.company_type === "brand" && c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))

        if (!brand) return res.sendStatus(404)
        res.json(brand);
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

    const newBrand = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: "brand"
    };
    companyStore.add(newBrand, err => {
        if (err) throw err;
        res.json(newBrand);
    });
});

module.exports = router;
