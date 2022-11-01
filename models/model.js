const mongoose = require('mongoose');


const Service = mongoose.model('Service', {
    id: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    auth: {
        required: true,
        type: String
    },
    headers: {
        required: true,
        type: Object
    },
    need_auth: {
        required: true,
        type: Boolean
    },
    url: {
        required: true,
        type: String
    }
})

module.exports = Service