const express = require('express');
const app = express();
const axios = require('axios');
const https = require('https');
const Service = require('./models/model');
const vault = require("./init.json")
const fetch = require('node-fetch');
require('dotenv').config()
require('./db/db');

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
        var options = {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${secret}`,
                'Content-Type': 'application/json',
                'Accept-Encoding': 'encoding/gzip,deflate',
                'Accept': 'application/json'
            },
            agent: new https.Agent({
                rejectUnauthorized: false
            })
        }
        if (req.method !== "GET" && req.method !== "DELETE" && req.method !== "HEAD" && req.method !== "OPTIONS") {
            options.body = JSON.stringify(req.body);
        }
        fetch(`${service.url}${req.url.split('/').slice(2).join('/')}`, options)
        .then(response => {           
            return {status: response.status, body: response.json(), headers: response.headers};
        })
        .then(async data => {
            res.set(Object.fromEntries(data.headers));
            res.oldWriteHead = res.writeHead;
            res.writeHead = function(statusCode, reasonPhrase, headers) {
                res.header('transfer-encoding', ''); // <-- add this line
                res.oldWriteHead(statusCode, reasonPhrase, headers);
            }
            res.status(data.status).send(await data.body)
        })
    } else {
        res.status(400).send({error: 'Secret or service not found'});
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});