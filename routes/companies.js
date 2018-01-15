const express = require('express');
const router = express.Router();
const companyStore = require('json-fs-store')('store/companies')

function getCompanyType(req) {
    if (req.baseUrl.substr(1) === "brands") return "brand"
    if (req.baseUrl.substr(1) === "factories") return "factory"
    return null
}

router.get('/', (req, res) => {
    const companyType = getCompanyType(req)
    if (!companyType) return res.sendStatus(404)

    companyStore.list((err, companies) => {
        if (err) throw err;
        const selectedCompanies = companies.filter(c => (c.company_type === companyType))
        res.json(selectedCompanies);
    });
});

router.get('/search', (req, res) => {
    const companyType = getCompanyType(req)
    if (!companyType) return res.sendStatus(404)
    const searchQuery = req.query.q

    companyStore.list((err, companies) => {
        if (err) throw err;

        const selectedCompany = companies.find(c => (
            c.company_type === companyType && c.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))

        if (!selectedCompany) return res.sendStatus(404)
        res.json(selectedCompany);
    });
});

router.get('/:id', (req, res) => {
    companyStore.load(req.params.id, (err, company) => {
        if (err) throw err;
        res.json(company);
    });
});

router.post('/', (req, res) => {
    const companyType = getCompanyType(req)
    if (!companyType) return res.sendStatus(404)
    if (!req.body) return res.sendStatus(400);

    const newCompany = {
        name: req.body.name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        city: req.body.city,
        state: req.body.state,
        company_type: companyType
    };
    companyStore.add(newCompany, err => {
        if (err) throw err;
        res.json(newCompany);
    });
});

module.exports = router;
