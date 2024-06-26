import { getSessionStorage } from "../util.js";

const host = "https://parseapi.back4app.com";
const applicationId = "dD6xuiyIpOFq891YlO2eUzYBp40F3OVZdD4pmRSJ";
const apiKey = "aprUTzayGDVPViuFqIbBtT50qPdbskp6GwpSiwJF";

async function request(method, url = "/", data) {
    const options = {
        method,
        headers: {
            "X-Parse-Application-Id": applicationId,
            "X-Parse-JavaScript-Key": apiKey
        }
    }

    if (data !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const userData = getSessionStorage();
    
    if (userData) {
        options.headers["X-Parse-Session-Token"] = userData.sessionToken;
    }

    try {
        const response = await fetch(host + url, options);

        if (response.code === 204) {
            return response;
        }
        
        const result = await response.json();

        if (response.ok != true) {
            throw new Error(result.error);
        }

        return result;
    } catch (err) {
        throw err;
    }
}

export const get = request.bind(null, "get");
export const post = request.bind(null, "post");
export const put = request.bind(null, "put");
export const del = request.bind(null, "delete");