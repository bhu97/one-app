/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = import('axios');
import config from './../utils/application.config.release'
import { responseToDriveItem, responseToListItem } from './../utils/object.mapping'
import { IDriveItem, IListItem, IWhitelist, Whitelist } from './../database/database';
import { InsertEmoticon } from '@material-ui/icons';


/**
 * Makes an Authorization 'Bearer' request with the given accessToken to the given endpoint.
 * @param endpoint 
 * @param accessToken 
 */
const callEndpointWithToken = async(endpoint: any, accessToken:any ):Promise<any> => {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    console.log('Request made at: ' + new Date().toString());
    const response = await (await axios).default.get(endpoint, options);
    return response.data;
}

const fetchNext = async(endpoint: string, accessToken:string, data:Array<any> ): Promise<any[]> => {

    const response = await callEndpointWithToken(endpoint, accessToken)
    //console.log("response nextLink: "+ response["@odata.nextLink"])
    //console.log("response value: "+ response["value"])
   
    if(response["@odata.nextLink"]) {
        const nextData = await fetchNext(response["@odata.nextLink"], accessToken, data.concat(response["value"])) as Array<any>
        return nextData 
    } else {
        console.log(response.value)
        return data.concat(response["value"]) 
    }
}

export const fetchDelta = async(accessToken: string): Promise<IDriveItem[]> => {
    let url = config.GRAPH_DELTA_ENDPOINT;
    const responses = await fetchData(url, accessToken);

    const flattenedResponses = responses.flat()
    let driveItems = flattenedResponses.map(responseToDriveItem);

    return driveItems;
}

const fetchData = async(url: string, accessToken: string): Promise<any[]> => {
    let allResponses = Array<any>();
    console.log("performing request: "+ url);
    const responses = await fetchNext(url, accessToken, allResponses);
    //console.log("all respones length: " + allResponses.length);
    return responses 
}

export async function fetchAdditionalMetadata(accessToken: string): Promise<IListItem[]> {
    let url = config.GRAPH_DRIVEITEM_ENDPOINT;
    const responses = await fetchData(url, accessToken);
    const flattenedResponses = responses.flat();
    let listItems = flattenedResponses.map(responseToListItem);

    return listItems;
}

export async function fetchWhitelists(urls: string[], accessToken: string): Promise<string[]> {
    //const requests = urls.map(async url => (await axios).default.get(url))
    
    const options = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "text-plain"
        }
    };

    const testUrl = "https://fresenius.sharepoint.com/teams/FMETS0269990/_layouts/15/download.aspx?UniqueId=f1f488fe-6ca0-4d03-804f-022a722df21f&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZnJlc2VuaXVzLnNoYXJlcG9pbnQuY29tQGM5OGRmNTM0LTVlMzYtNDU5YS1hYzNmLThjMmU0NDk4NjNiZCIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE2MzEzNTM5ODciLCJleHAiOiIxNjMxMzU3NTg3IiwiZW5kcG9pbnR1cmwiOiJ0NmxSK3VSdnRrdUNFLytQaUJlTGdrSDZwWkw0Zk4rdk5MdDBhTzdHR3dnPSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTM5IiwiaXNsb29wYmFjayI6IlRydWUiLCJjaWQiOiJNemMxTURGaFpqQXRNVFF5TlMwMFlqZ3pMVGhqWlRJdE9EZzVNV00yTURrM09USTUiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiWldRMk9HRTBNVEF0TVRjM05DMDBZMkprTFRreFlqZ3RaVEl5TkRBelpEQmxNMk0yIiwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJnaXZlbl9uYW1lIjoiTWF0dGhpYXMiLCJmYW1pbHlfbmFtZSI6IkJyb2RhbGthIiwic2lnbmluX3N0YXRlIjoiW1wia21zaVwiXSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwidGlkIjoiYzk4ZGY1MzQtNWUzNi00NTlhLWFjM2YtOGMyZTQ0OTg2M2JkIiwidXBuIjoibWF0dGhpYXMuYnJvZGFsa2FAZnJlc2VuaXVzLW5ldGNhcmUuY29tIiwicHVpZCI6IjEwMDM3RkZFOUZGRDgzNTQiLCJjYWNoZWtleSI6IjBoLmZ8bWVtYmVyc2hpcHwxMDAzN2ZmZTlmZmQ4MzU0QGxpdmUuY29tIiwic2NwIjoiYWxsZmlsZXMud3JpdGUgZ3JvdXAud3JpdGUgYWxsc2l0ZXMud3JpdGUgYWxscHJvZmlsZXMucmVhZCBhbGxwcm9maWxlcy53cml0ZSIsInR0IjoiMiIsInVzZVBlcnNpc3RlbnRDb29raWUiOm51bGx9.ZFhGenFZdnJIOXJFbGp1djNwMlJNVkV2YjF2cUdVQ3FabC9jS29tUzMyND0&ApiVersion=2.0"
    const dlResponse = await (await axios).default.get(testUrl, options)
    console.log(dlResponse);
    
    if (dlResponse.status == 302) {
        const response = await (await axios).default.get(dlResponse.request!.responseURL, options)
        console.log(response);
        
    } 

    return []
}

export async function fakeFetchWhitelists(): Promise<Array<IWhitelist>> {
    const whitelists = Array<IWhitelist>()
    const files = ["whitelist-SAU.txt", "whitelist-DNK.txt", "whitelist-DEV.txt", "whitelist-DNK.txt", "whitelist-ROU.txt", "whitelist-ZAF.txt", "whitelist-MASTER_ENG.txt"]
    
    for (const file of files) {
        const response = await fetch(`./../../../assets/${file}`)
        const content = await response.text()
        const country = findCountry(file)
        if (country !== "") {
            whitelists.push(new Whitelist(country, content))
        }
    }
    return whitelists
}

function findCountry(string:string): string {
    let result = string.split("-")
    if(result.length > 1) {
      const countryCode = result[1].replace(".txt", "");
      return countryCode
    }
  
    return ""
  }

// export default {
//     callEndpointWithToken: callEndpointWithToken,
//     fetchDelta: fetchDelta,
//     fetchAdditionalMetadata: fetchAdditionalMetadata
// };
