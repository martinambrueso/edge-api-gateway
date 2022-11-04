const axios = require("axios");
require('dotenv').config('../.env')
const secret = require('../init.json');

var data = JSON.stringify({
  "data": {
    "token": "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"
  },
  "options": {},
  "version": 0
});

var config = {
  method: 'post',
  url: 'http://127.0.0.1:3000/v1/kv/data/github',
  headers: { 
    'X-Vault-Token': secret.root_token,
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
