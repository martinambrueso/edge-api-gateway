const Service = require('../models/model');
const mongoose = require('mongoose');
require('dotenv').config()
require('../db/db');

Service.createCollection().then(function (collection) {
    console.log('Collection is created!');
});

Service.insertMany([
    {
        "need_auth": true,
        "id": "98741f28-f162-49d1-85a7-a4a4a1c3217d",
        "name": "github",
        "url": "https://api.github.com/",
        "auth": "token #data#",
        "headers": {
            "Accept": "application/json"
        }
    },
    {
        "need_auth": false,
        "id": "301c86b8-f931-41de-a6b7-3d4987552883",
        "name": "aws",
        "url": "https://api.aws.com/",
        "auth": "token #data#",
        "headers": {
            "Accept": "application/json"
        }
    },
    {
        "need_auth": false,
        "id": "301c86b8-f931-41de-a6b7-3d4987552883",
        "name": "reqres",
        "url": "https://reqres.in/",
        "auth": "token #data#",
        "headers": {
            "Accept": "application/json"
        }
    },
    {
        "need_auth": false,
        "id": "301c86b8-f931-41de-a6b7-3d4987552883",
        "name": "reqres",
        "url": "https://jsonplaceholder.typicode.com/users'",
        "auth": "token #data#",
        "headers": {
            "Accept": "application/json"
        }
    }
])

