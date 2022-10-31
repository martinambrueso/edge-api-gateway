const express = require('express');
const app = express();
const axios = require('axios');
const https = require('https');
const mongoose = require('mongoose');
const Service = require('./models/model');
require('dotenv').config()

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
    authSource: "admin",
    user: "root",
    pass: "example",
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const model = new Service();

async function get_secret(service) {
    if (service.need_auth === true) {
        try {
            const secret = await axios.get(
                `${process.env.VAULT_URL}${service.name}`, 
                {
                  headers: {
                    "X-Vault-Token": process.env.VAULT_TOKEN
                  }
                }
              )
            return secret.data.data.data.token;
        } catch (error) {
            return {error: true, message: error}
        }
    } else {
        return "No auth needed"
    }
}

async function get_service(service) {
    try{
        const data = await Service.findOne({name: service});
        return data;
    } catch (error) {
        return {error: true, message: error}
    }
}

app.all('/:service/*', async(req, res) => {
    const service = await get_service(req.params.service);
    const secret = await get_secret(service);

    if (secret.error !== true) {
        axios({
            method: req.method,
            url: `${service.url}${req.url.split('/').slice(2).join('/')}`,
            headers: {
                'Authorization': service.auth.replace('#data#', secret)
            },
            data: req.body,
            responseType: 'stream',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then((response) => {
            res.setHeader('Content-Type', 'application/json');
            response.data.pipe(res)
        })
    } else {
        res.status(400).send({error: 'Secret not found'});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});