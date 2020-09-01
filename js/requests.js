const http = require('http');

function get(url) {
    const parsedUrl = url.split('//').pop();
    const [ host, ...pathSegments ] = parsedUrl.split('/');
    const path = '/' + pathSegments.join('/');
    return new Promise((resolve, reject) => {
        const req = http.request({
            host,
            path
        }, res => {
            console.log('GET REQUEST - STATUS CODE: ', res.statusCode);
            let result = '';
            res.on('data', chunk => result += chunk);
            res.on('end', () => resolve(result));
            res.on('error', err => reject(err));
        })
        req.end();
    });
}

function post(url, data) {
    const parsedUrl = url.split('//').pop();
    const [ host, ...pathSegments ] = parsedUrl.split('/');
    const path = '/' + pathSegments.join('/');
    return new Promise((resolve, reject) => {
        const req = http.request({
            host,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }, res => {
            console.log('POST REQUEST - STATUS CODE: ', res.statusCode);
            let result = '';
            res.on('data', chunk => result += chunk);
            res.on('end', () => resolve(result));
            res.on('error', err => reject(err));
        })
        req.write(JSON.stringify(data));
        req.end();
    });
}

exports.get = get;
exports.post = post;