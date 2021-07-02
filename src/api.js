

    const SERVER = "https://api.mazar.app/api/v1";

function generateHeader(object) {
    const header = {};
    if (localStorage.getItem('token') && localStorage.getItem('token').length > 0) {
        header['Authorization'] = 'jwt ' + localStorage.getItem('token');
    }
    for (const key of Object.keys(object)) {
        header[key] = object[key];
    }
    return header;
}


export function del(url, body) {
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(SERVER + url, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: generateHeader({ 'Content-Type': 'application/json' }),
        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}

export function post(url, body) {
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(SERVER + url, {
            method: 'POST',
            headers: generateHeader({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body)
        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}
export function form(url, body) {
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(SERVER + url, {
            method: 'POST',
            body: body,
            headers: generateHeader(),

        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}
export function put(url, body) {
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(SERVER + url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: generateHeader({ 'Content-Type': 'application/json' }),
        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}

export function patch(url, body) {
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(SERVER + url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: generateHeader({ 'Content-Type': 'application/json' })
        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}

export function get(url, params = {}) {
    const generatedUrl = new URL(SERVER + url)
    Object.keys(params).forEach(key => {
        if (params[key]){
            generatedUrl.searchParams.append(key, params[key])
        }
    })
    let status = null;
    return new Promise((resolve, reject) => {
        fetch(generatedUrl, {
            method: 'GET',
            headers: generateHeader({ 'Content-Type': 'application/json' }),
        }).then(function (response) {
            status = response.status;
            return response.json();
        }).then(function (data) {
            resolve({ data, status });
        }).catch((err) => {
            resolve({ data: null, status });
        });
    })
}


export function upload(URL, formData, onProgress) {
    let abort;
    const promise = new Promise((resolve) => {
        const request = new XMLHttpRequest();
        abort = request.abort;
        request.onload = function () {
            if (request.readyState == XMLHttpRequest.DONE)
                resolve({ status: request.status, data: JSON.parse(request.responseText) });
            else resolve({ status: request.status, data: null });
        };
        request.upload.addEventListener('progress', function (e) {
            onProgress(e.loaded);
        });
        request.open('post', SERVER + URL);
       // request.setRequestHeader('Authorization', 'jwt ' + authToken.get()?.access);
        request.timeout = 45000;
        request.send(formData);
    });
    return { promise, abort };
}


export function responseValidator(status) {
    return status >= 200 && status < 300;
}
