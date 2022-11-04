const express = require('express');
const app = express();
const axios = require('axios');
const https = require('https');
const mongoose = require('mongoose');
const Service = require('./models/model');
require('dotenv').config()
require('./db/db');
const vault = require("./init.json")
const fetchUrl = require('fetch').fetchUrl;
app.use(express.json());

async function get_secret(service) {
    if (service.need_auth === true) {
        try {
            const secret = await axios.get(
                `${process.env.VAULT_URL}${service.name}`, 
                {
                  headers: {
                    "X-Vault-Token": vault.root_token
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

    if (secret.error !== true && service.error !== true) {
        fetchUrl(`${service.url}${req.url.split('/').slice(2).join('/')}`, {
            method: req.method,
            headers: {
                "Authorization": service.auth.replace("#data#", secret),
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            payload: JSON.stringify(req.body)
        }, function(error, meta, body){
            res.setHeader('Content-Type', 'application/json');
            res.status(meta.status).send(body.toString());
        });
    } else {
        res.status(400).send({error: 'Secret or service not found'});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});