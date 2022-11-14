const express = require('express');
const app = express();
const axios = require('axios');
const Service = require('./models/model');
const vault = require("./init.json")
const console = require('console');
require('dotenv').config()
require('./db/db');
const { createProxyMiddleware } = require('http-proxy-middleware');

(async () => {
    
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

    async function get_services() {
        try{
            const data = await Service.find();
            return data;
        } catch (error) {
            return {error: true, message: error}
        }
    }

    const service = await get_services()
    
    service.forEach(async service => {
        const secret = await get_secret(service)
        console.log(secret)
        app.use(
            `/${service.name}`,
            createProxyMiddleware({
                secure: false,
                target: service.url,
                changeOrigin: true,
                pathRewrite: {
                    [`^/${service.name}`]: '',
                },
                onProxyReq: function(proxyReq, req, res) {
                    proxyReq.setHeader('Authorization', `token ${secret}`);
                }
            })
          );
    })

    app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`);
    });

})();