/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios from 'axios';
import config from './../utils/application.config.release'
import { responseToDriveItem, responseToListItem } from './../utils/object.mapping'
import { IDriveItem, IListItem, IWhitelist, Whitelist } from './../database/database';

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
    const response = await axios.get(endpoint, options);
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
    let url = config.GRAPH_DRIVEITEMS_ENDPOINT;
    const responses = await fetchData(url, accessToken);
    const flattenedResponses = responses.flat();
    let listItems = flattenedResponses.map(responseToListItem);

    return listItems;
}

export async function fetchWhitelists(driveItems: IDriveItem[], accessToken: string): Promise<IWhitelist[]> {

    let whitelists:IWhitelist[] = []

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    const network = axios.create()

    for(const driveItem of driveItems) {
        if(driveItem.listItemId) {
            let driveItemUrl = config.GRAPH_DRIVEITEM_ENDPOINT(driveItem.listItemId)
            const driveItemResponse = await window.electron.ipcRenderer.fetchDriveItem({driveItemId: driveItem.listItemId})

            const downloadUrl = driveItemResponse.graphDownloadUrl as string
            if(downloadUrl) {
                const whitelistResponse = await axios.get(downloadUrl)
                const whitelistContent = whitelistResponse.data as string
                if(whitelistContent && driveItem.country) {
                    whitelists.push({country: driveItem.country, content: whitelistContent})
                }
            }
        }
    }

    return whitelists
}

export async function fetchDriveItem(driveItemId: string, accessToken: string): Promise<IDriveItem | null> {

    //window.sessionStorage.clear()
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        }
    };
     let driveItemUrl = config.GRAPH_DRIVEITEM_ENDPOINT(driveItemId)
    // let driveItemResponse = await axios.get(driveItemUrl, options);
    //console.log("driveitemresponse: "+JSON.stringify(driveItemResponse.data));
    //console.log("download url "+JSON.stringify(driveItemResponse.data.driveItem["@microsoft.graph.downloadUrl"]));
    let driveItemResponse = await window.electron.ipcRenderer.performRequest({url: driveItemUrl, options: options})
    if(driveItemResponse) {
        let driveItem = responseToDriveItem(driveItemResponse)
        return driveItem
    }

    return null
}

async function downloadDriveItem(driveItemId: string, accessToken: string): Promise<any> {
    const driveItem = await fetchDriveItem(driveItemId, accessToken)
    if(driveItem) {

    }
}

export async function fetchLastModifiedDate(accessToken: string): Promise<string> {
    const response = await callEndpointWithToken(config.GRAPH_LASTMODIFIED_DATE, accessToken)
    return response.value[0].lastModifiedDateTime    
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
