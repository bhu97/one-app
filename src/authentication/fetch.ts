/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const axios = import('axios');
import config from './../utils/application.config.release'
import { responseToDriveItem, responseToListItem } from 'utils/object.mapping'
import { IDriveItem, IListItem } from 'database/database';
import { InsertEmoticon } from '@material-ui/icons';


/**
 * Makes an Authorization 'Bearer' request with the given accessToken to the given endpoint.
 * @param endpoint 
 * @param accessToken 
 */
const callEndpointWithToken = async(endpoint: any, accessToken:any ) => {
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
    let url = config.GRAPH_DRIVEITEM_ENDPOINT
    const responses = await fetchData(url, accessToken)
    const flattenedResponses = responses.flat()
    let listItems = flattenedResponses.map(responseToListItem);
    
    return listItems
}

// export default {
//     callEndpointWithToken: callEndpointWithToken,
//     fetchDelta: fetchDelta,
//     fetchAdditionalMetadata: fetchAdditionalMetadata
// };
