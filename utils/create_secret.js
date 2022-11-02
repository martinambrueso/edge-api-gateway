const axios = require("axios");
require('dotenv').config('../.env')


var data = JSON.stringify({
  "data": {
    "token": "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"
  },
  "options": {},
  "version": 0
});

var config = {
  method: 'post',
  url: 'http://127.0.0.1:3000/v1/kv/data/tes2',
  headers: { 
    'X-Vault-Token': process.env.VAULT_TOKEN,
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
