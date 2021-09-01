export default {
  //Azure IDs
  // Find all details here https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/054ed5dd-8447-4c78-856b-5a0462bf0e68/isMSAApp/
  CLIENT_ID:"054ed5dd-8447-4c78-856b-5a0462bf0e68",
  TENANT_ID:"c98df534-5e36-459a-ac3f-8c2e449863bd",
  DIVE_ID: "b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG",

  //Configs regarding the file list paths
  ROOT_PATH: "/teams/FMETS0269990/",
  FIRST_LEVEL_PATH: "/teams/FMETS0269990/Shared%20Documents/",

  //Configuration
  REDIRECT_URI:"preisfindungstool://auth",

  //Endpoints
  AAD_ENDPOINT_HOST:"https://login.microsoftonline.com/",
  GRAPH_ENDPOINT_HOST:"https://graph.microsoft.com/",

  // RESOURCES
  GRAPH_ME_ENDPOINT:"v1.0/me",
  GRAPH_MAIL_ENDPOINT:"v1.0/me/messages",
  GRAPH_DELTA_ENDPOINT:"v1.0/root?delta/$select=sharepointIds, title, name, webUrl, fields,parentReferenceIds",
  GRAPH_DRIVEITEM_ENDPOINT:"v1.0/sites/ed68a410-1774-4cbd-91b8-e22403d0e3c6/lists/b6172375-d599-467b-8327-301b20dc3a06/items?$expand=fields, driveitem&$select=fields, id, contentType, id",
  // SCOPES
  GRAPH_SCOPES:"User.Read Sites.Read.All" 
}