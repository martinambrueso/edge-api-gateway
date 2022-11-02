const axios = require("axios");
require('dotenv').config()

const keys = [
    '8425d322d28e2b811a8cdab53ebf6500029cf8c4a568eb0f09fcd65aaf93459e'
]

keys.forEach(key => {
    var data = JSON.stringify({
        "key": key
      });
      
      axios({
        method: 'post',
        url: 'http://127.0.0.1:3000/v1/sys/unseal',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      })
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
})    