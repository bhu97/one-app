import { AuthenticationResult } from "@azure/msal-node"
import dayjs from "dayjs"

// cuts everything in a sharepoint url before and including "Shared Documents"
// so you get the relative path out of a SharePoint weburl
//
export const normalizeUrl = (url: string): string => {
  const components = url.split("Shared%20Documents")
  if(components.length>0) {
    return components[1]
  }
  return url
}

export const findCountry = (string : string): string | null => {
  let result = string?.split("/")
  if(result  && result.length > 1) {
    if(result[0] === "/" || result[0] === "") {
      const countryCode = result[1]
      return countryCode
    }
    const countryCode = result[0]
    return countryCode
  }
  return null
}

export const notEmpty = <T>(value: T): value is NonNullable<typeof value> => !!value 

export const isTokenValid = (authResult: AuthenticationResult):boolean => {
  let currentDate = dayjs()
  let expirationDate = authResult.expiresOn
  
  return currentDate.isBefore(expirationDate)
}

export const nameWithoutPrefix = (name:string):string => {
  let regex = RegExp("^\\d{3}\\s?")
  return name.replace(regex, "")
}