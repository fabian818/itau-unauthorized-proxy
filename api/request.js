const axios = require('axios');
const querystring = require('querystring');
const db    = require('./db.js');


String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const getUId = (cognitoId, callback) => {
    db.findOne({
        where: {optional_id: cognitoId},
        attributes: ['id', 'optional_id']
    })
    .then(user => {
        console.log(user.toJSON());
        callback(user.toJSON().id.splice(8, 0, "-").splice(13, 0, "-").splice(18, 0, "-").splice(23, 0, "-"));
    })
    .catch(err => {
        console.log(err);
    })
}

const api = (input, callback) => {
    let path = process.env['LOAD_BALANCER'];
    let query = '';
    if(input.querystring){
        query = '?' + querystring.stringify(input.querystring);
    }
    if (input.path.charAt(0) === '/') {
        input.path = input.path.substring(1);
    }
    let url = `${path}${input.path}`;
    if (url.charAt( url.length-1 ) !== '/') {
        url = url + '/';
    }
    // to evaluate in whitelist (url variable)
    url += query;
    console.log('url', url);
    axios({
        method: input.method,
        url: url,
        data: JSON.parse(input.body),
        headers: {'Component': input.router}
    })
    .then(function(response) {
        console.log('response', response.data);
        let message = {
            "message": response.data,
            "status": 200
        }
        callback(message);
    }).catch(function (error) {
        console.log(error);
        let message = {
            "message": error.response.data,
            "status": error.response.status
        }
        // console.log('response', error.response)
        callback(message);
    });
}

const createUser = (cognitoId, username, callback) => {
    let path = process.env['LOAD_BALANCER'];
    let url = `${path}users/`;
    console.log('url', url);
    axios({
        method: 'post',
        url: url,
        data: {
            "email": username,
            "optional_id": cognitoId,
            "data_json": {
                "from": "",
                "to": ""
            }
        },
        headers: {'Component': 'django-ubankapi'}
    })
    .then(response => {
        console.log('response', response.data);
        callback(response.data);
    })
    .catch(err => {
        console.log(err);
        console.log(err.data.error);
    })
}

module.exports = {api: api, getUId: getUId, createUser: createUser};
