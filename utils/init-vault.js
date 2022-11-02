const axios = require("axios");
const https = require('https');


var options = {
    apiVersion: 'v1', // default
    endpoint: 'http://127.0.0.1:3000', // default
    token: '1234' // optional client token; can be fetched after valid initialization of the server
};

// get new instance of the client
var vault = require("node-vault")(options);


function init(){
    return vault.init({ secret_shares: 1, secret_threshold: 1 }).then((result) => {
        return new Promise((resolve, reject) => {
            var keys = result.keys;
            vault.token = result.root_token;
        
            vault.unseal({ secret_shares: 1, key: keys[0] })
        
            resolve({ keys, token: result.root_token });
        })
    })
}

async function main(){
    const init_data = await init();

    console.log(init_data);

    setTimeout(async() => {       
        await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/v1/sys/mounts/kv',
            headers: { 
            'X-Vault-Token': init_data.token, 
            'Content-Type': 'application/json'
            },
            data : JSON.stringify({
                "type": "kv",
                "options": {
                    "version": "2"
                },
                "max_versions": 5,
                "cas_required": false,
                "delete_version_after": "3h25m19s"
            })
        })
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        }); 

        console.log(init_data.token)

        await axios.post('http://127.0.0.1:3000/v1/kv/data/github', {
            headers: {
                'X-Vault-Token': init_data.token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "data": {
                    "token": "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"
                },
                "options": {},
                "version": 0
            })
        })

    }, 5000);
}

main()