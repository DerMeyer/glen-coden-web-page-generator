class RequestService {
    get(url) {
        return Promise.resolve()
            .then(() => fetch(url))
            .then(resp => resp.json())
            .catch(err => console.error(err));
    }

    post(url, data) {
        return Promise.resolve()
            .then(() => JSON.stringify(data))
            .then(body => fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body
            }))
            .then(resp => resp.json())
            .catch(err => console.error(err));
    }
}

export default RequestService;