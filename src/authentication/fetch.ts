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

async function fetchNext(endpoint: string, accessToken:string, data:Array<any> ): Promise<any[]> {

    const response = await callEndpointWithToken(endpoint, accessToken)
    //console.log("response nextLink: "+ response["@odata.nextLink"])
    //console.log("response value: "+ response["value"])
    if(response["@odata.nextLink"]) {
        const nextData = await fetchNext(response["@odata.nextLink"], accessToken, [...data, response["value"]]) as Array<any>
        return nextData 
    } else {
        return [...data, response["value"]] 
    }
}

async function fetchDelta(url: string, accessToken: string): Promise<any[]> {
    let allResponses = Array<any>();
    const responses = await fetchNext(url, accessToken, allResponses)
    //console.log("all respones length: " + allResponses.length);
    return responses
}

async function fetchAdditionalMetadata(accessToken: string): Promise<any[]> {
    let url = ""
    const responses = await fetchDelta(url, accessToken)
    return responses
}

module.exports = {
    callEndpointWithToken: callEndpointWithToken,
    fetchDelta: fetchDelta
};
