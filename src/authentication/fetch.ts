/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = import('axios');

/**
 * Makes an Authorization 'Bearer' request with the given accessToken to the given endpoint.
 * @param endpoint 
 * @param accessToken 
 */
async function callEndpointWithToken(endpoint: any, accessToken:any ) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('Request made at: ' + new Date().toString());

    const response = await (await axios).default.get(endpoint, options);

    return response.data;
}

module.exports = {
    callEndpointWithToken: callEndpointWithToken,
};
