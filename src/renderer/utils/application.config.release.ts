export default {

  APP_VERSION: "1.0.12",
  //Azure IDs
  // Find all details here https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/054ed5dd-8447-4c78-856b-5a0462bf0e68/isMSAApp/
  CLIENT_ID:"054ed5dd-8447-4c78-856b-5a0462bf0e68",
  TENANT_ID:"c98df534-5e36-459a-ac3f-8c2e449863bd",
  DIVE_ID: "b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG",

  //Configs regarding the file list paths
  ROOT_PATH: "/teams/FMETS0269990/",
  ROOT_ID: "01GX2IG4N6Y2GOVW7725BZO354PWSELRRZ",
  FIRST_LEVEL_PATH: "/teams/FMETS0269990/Shared%20Documents/",
  ROOT_WEB_URL: "https://fresenius.sharepoint.com/teams/FMETS0269990/Shared%20Documents/",
  ROOT_LOGIN_URL : "https://fresenius.sharepoint.com/",
  ROOT_LOGOUT_URL: "https://fresenius.sharepoint.com/_layouts/15/SignOut.aspx",
  //Configuration
  REDIRECT_URI:"preisfindungstool://auth",

  INTERACTIVE_LOGIN_HOSTS: [
    "fresenius.com",
    "login.microsoftonline.com"
  ],

  //Endpoints
  AAD_ENDPOINT_HOST:"https://login.microsoftonline.com/",
  GRAPH_ENDPOINT_HOST:"https://graph.microsoft.com/",

  // RESOURCES
  GRAPH_ME_ENDPOINT:"v1.0/me",
  GRAPH_MAIL_ENDPOINT:"v1.0/me/messages",
  GRAPH_DELTA_ENDPOINT:"https://graph.microsoft.com/v1.0/drives/b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG/root/delta?$select=id, sharepointIds, title, name, webUrl, fields, parentReference, file, lastModifiedDateTime, size",
  GRAPH_DRIVEITEMS_ENDPOINT:"https://graph.microsoft.com/v1.0/sites/ed68a410-1774-4cbd-91b8-e22403d0e3c6/lists/b6172375-d599-467b-8327-301b20dc3a06/items?$expand=fields, driveitem&$select=fields, id, contentType",
  GRAPH_DRIVEITEM_ENDPOINT: (itemId: string) => `https://graph.microsoft.com/v1.0/sites/ed68a410-1774-4cbd-91b8-e22403d0e3c6/lists/b6172375-d599-467b-8327-301b20dc3a06/items/${itemId}?$expand=driveItem`,
  GRAPH_LASTMODIFIED_DATE: "https://graph.microsoft.com/v1.0/drives/b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG/root/delta?$top=1&$orderBy=lastModifiedDateTime+DESC",
  GRAPH_THUMBNAILS_ENDPOINT: (uniqueId:string) => `https://graph.microsoft.com/v1.0/drives/b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG/items/${uniqueId}/children?$expand=thumbnails`,
  GRAPH_ITEM_THUMBNAIL_ENDPOINT: (uniqueId:string) => `https://graph.microsoft.com/v1.0/drives/b!EKRo7XQXvUyRuOIkA9DjxunkygQdu11AmW6wdTRwuw91Ixe2mdV7RoMnMBsg3DoG/items/${uniqueId}?$expand=thumbnails`,
  // SCOPES
  GRAPH_SCOPES:"User.Read Sites.Read.All",
  KNOWN_AUTHORITIES:[
    "https://login.microsoftonline.com/",
    "https://login.microsoftonline.com/c98df534-5e36-459a-ac3f-8c2e449863bd",
    "https://login.microsoftonline.com/organizations",
  ],
  SENDGRID_API_KEY: "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",
  SENDER_EMAIL: "noreply.fmcone@fmc-ag.com"
}
