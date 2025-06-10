// const request = async (method, token, url, data) => {

//     const options = {
//         method,
//         credentials: 'include',
//     };

//     if (data) {
//         if (data instanceof FormData) {
//             options.body = data;
//         } else {
//             options.body = JSON.stringify(data);
//             options.headers = { 'Content-Type': 'application/json' };
//         }
//     }

//     if (token) { options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` }; }

//     const response = await fetch(url, options);

//     const result = await response.json();

//     if (!response.ok) {
//         if (result.problemDetails.errors.length > 0) {
//             throw result.problemDetails.errors;
//         }

//         throw result;
//     }

//     return result?.data ?? result;
// };

const request = async (method, token, url, data) => {
    const options = {
        method,
        credentials: 'include',
        headers: {}
    };

    if (data) {
        if (data instanceof FormData) {
            options.body = data;
            // Let browser handle Content-Type
        } else {
            options.body = JSON.stringify(data);
            options.headers['Content-Type'] = 'application/json'; // ✅ set safely
        }
    }

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    const result = await response.json();

    if (!response.ok) {
        if (result.problemDetails?.errors?.length > 0) {
            throw result.problemDetails.errors;
        }

        throw result;
    }

    return result?.data ?? result;
};


export const requestFactory = (token) => {
    return {
        get: request.bind(null, 'GET', token),
        post: request.bind(null, 'POST', token),
        put: request.bind(null, 'PUT', token),
        patch: request.bind(null, 'PATCH', token),
        delete: request.bind(null, 'DELETE', token),
    }
};