import { Button, Card, CardActions, CardContent, Container, FormControl, Grid, InputLabel, ListItem, ListItemText, makeStyles, MenuItem, Select, Typography} from '@material-ui/core';

import React, { FC, Fragment, useEffect, useState } from 'react';
import Sidebar from 'renderer/components/ui/Sidebar';


import { LoadingDialog } from 'renderer/components/ui/Loading';

import { AuthenticationResult } from '@azure/msal-node';
import {fakeFetchWhitelists, fetchAdditionalMetadata, fetchDelta, fetchDriveItem, fetchLastModifiedDate, fetchWhitelists} from './../../../authentication/fetch'
import { CountryVersion, db } from 'database/database';
import { LightStore } from 'database/stores/LightStore';
import { responseToDriveItem, responseToListItem } from 'utils/object.mapping';
import { FlexStore } from 'database/stores/FlexStore';
import { LinkedStore } from 'database/stores/LinkedStore';
import { localStorgeHelper } from 'database/storage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: theme.palette.primary.main,
    overflow: 'auto'
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
  button: {
    marginRight: `${theme.spacing(2)} !important`,
  },
  longBuildDurationWarning: {
    marginBottom: theme.spacing(1),
  },
  buildResponse: {
    marginBottom: theme.spacing(1),
  },
  tooltip: {
    paddingLeft: '1em',
    paddingRight: '1em',
    fontSize: '1.4em !important',
    '& a': {
      color: '#90caf9',
    },
  },
  card: {
    color: theme.palette.primary.main,
    margin: '1em'
  }
}));

type DevSettingsProps = {
 
}

type DevSettingsState = {
  isLoading: boolean,
  token: string,
  countries: string[],
  selectedCountry: string,
  version: string,
  lastModifiedDateTime?: string
  showUpdateAlert?: boolean
}

const DevSettings: FC<DevSettingsProps> = () => {

  const authResult:AuthenticationResult = {
    authority: "",
    uniqueId: "string;",
    tenantId: "string;",
    scopes: ["Read"],
    account: null,
    idToken: "string;",
    idTokenClaims: {},
    accessToken: "string;",
    fromCache: true,
    expiresOn: null,
    tokenType: "string;"
};
  
  useEffect(() => {
    //setupDummyData()

    async() => {
      await loadCurrentUser()
      await loadCountries()
      setState({...state, showUpdateAlert: localStorgeHelper.shouldShowUpdateAlert()})
    }
  }, [])
  const classes = useStyles();
  const [state, setState] = useState<DevSettingsState>({
    isLoading: false, 
    token: "", 
    countries: [], 
    selectedCountry: "", 
    version: "none", 
    lastModifiedDateTime: localStorgeHelper.getLastModifiedDate() ?? "",
    showUpdateAlert: localStorgeHelper.shouldShowUpdateAlert()
  })

  const login = async() => {
    let token = await window.electron.ipcRenderer.login("")
    console.log("finished my login: "+ token);
  }

  const refresh = async() => {
    let result = await window.electron.ipcRenderer.refreshTokenSilently()
    localStorage.setItem("token", result.accessToken)
    console.log("token: "+ JSON.stringify(result));
  }

  const save = async() => {
    await saveAuthToStorage(authResult)
    console.log(await getAuthFromStorage())
  }

  const saveAuthToStorage = async (authorization: AuthenticationResult) => {
    return await localStorage.setItem("authorization", JSON.stringify(authorization))
  }

  const getAuthFromStorage = async (): Promise<AuthenticationResult | null> => {
    const result = await localStorage.getItem("authorization");
    if (result) {
      return JSON.parse(result) as AuthenticationResult ?? null
    }
    return null
  }

  const getDelta = async() => {
    const token = localStorage.getItem("token")
    if(token) {
      setState({...state, isLoading: true})
      try {
        //FETCH DETLA
      let deltaData = await fetchDelta(token);
      console.log(deltaData);
      await db.save(deltaData);

      //FETCH METADATA
      let metaData = await fetchAdditionalMetadata(token);
      await db.saveMetaData(metaData);

      //CREATE USER
      //SET COUNTRY/VERSION
      await db.createUserIfEmpty()

      await db.setupInitialFavoriteGroup()

      const whitelistDriveItems = await db.getAllWhitelists()
      let whitelists = await fetchWhitelists(whitelistDriveItems, token)
      await db.saveWhitelists(whitelists)

      localStorgeHelper.setLastMetdataUpdate()
      setState({...state, isLoading: false})


      //FETCH WHITELISTS
      } catch (error) {
        console.log(error);
        setState({...state, isLoading: false})
      }
      
    }
  }

  const loadCountries = async() => {
    const allCountries = await db.getAllAvailableCountries()
    if(allCountries) {
      setState({...state, countries: allCountries})
    }
    console.log(allCountries);
  }

  const loadCurrentUser = async() => {
    const user = await db.getUser()
    if (user) {
      console.log(CountryVersion[parseInt(user.version)])
      setState({...state, version: CountryVersion[parseInt(user.version)], selectedCountry: user.country});
    }
  }

  const selectedCountry = async(country: string) => {
    console.log("seleccted country: "+country);
    setState({...state, selectedCountry: country});
    await db.selectCurrentCountry(country);
    await loadCurrentUser();
  }

  const loadWhitelists = async() => {
    const token = localStorage.getItem("token")
    if(token) {
      const whitelistDriveItems = await db.getAllWhitelists()
      let whitelists = await fetchWhitelists(whitelistDriveItems, token)
      await db.saveWhitelists(whitelists)
      console.log(whitelists);
    }
  }

  const setupDummyData = async() => {
    
    if(await db.isEmpty()) {
      setState({...state, isLoading: true})
  
      let deltaResponse = await fetch('./../../../assets/delta.json');  
      let deltaResponseJson = await deltaResponse.json();
      //console.log(deltaResponseJson.value[0]);
      let driveItems = deltaResponseJson.value.map(responseToDriveItem);
      await db.save(driveItems);
  
      let listitemResponse = await fetch('./../../../assets/listitem.json');
      let listitemResponseJson = await listitemResponse.json();
      console.log(listitemResponseJson.value[0]);
      let listItems = listitemResponseJson.value.map(responseToListItem);
      await db.saveMetaData(listItems)
  
      const whitelists = await fakeFetchWhitelists();
      console.log(whitelists);
      db.saveWhitelists(whitelists);

      db.setupInitialFavoriteGroup()

      setState({...state, isLoading: false})
    }
  }

  const loadLighStore = async() => {
    let store = new LightStore({})
    await store.update()
    console.log(store.items)
  }

  const loadFlexStore = async() => {
    let store = new FlexStore({})
    await store.update()
    console.log(store.items)
  }

  const loadLinkedStore = async() => {
    let store = new LinkedStore({query: "01GX2IG4JQHK2LKOD6LFA3L54XT2KDUS5W"})
    await store.update()
    console.log(store.items)
  }

  const loadLastModifiedDate = async() => {
    const token = localStorage.getItem("token")
   
    if(token) {
      const date = await fetchLastModifiedDate(token)
      console.log(date);
      localStorgeHelper.setLastModifiedDate(date)
      setState({...state, lastModifiedDateTime: localStorgeHelper.getLastModifiedDate() ?? ""})
    }
  }

  const downloadTestFile = async() => {
    const token = localStorage.getItem("token")
   
    if(token) {
      const driveItem = await fetchDriveItem("36066", token)
      if(driveItem && driveItem.graphDownloadUrl) {
        let downloadItem = await window.electron.ipcRenderer.downloadFile(driveItem.graphDownloadUrl)
        console.log(downloadItem);
      }
    }
  }
    return (
      <Fragment>
      <main className={classes.root}>
        <Sidebar navigationEnabled={true}>
        </Sidebar>
        <div className={classes.content}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h3" component="p">
              Developer Settings for testing
            </Typography>
          </CardContent>
        </Card> 

        <Grid container spacing={3}>
          <Grid item>
            <ListItem button>
              <ListItemText primary="Login" secondary={state.token} onClick={() => {login()}}/>
            </ListItem>
          </Grid>
          <Grid item>
            <ListItem button>
              <ListItemText primary="Get Token Silent" secondary={state.token} onClick={() => {refresh()}}/>
            </ListItem>     
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item>
            <ListItem button>
              <ListItemText primary="Load dummy data" secondary="Load local data" onClick={() => {setupDummyData()}}/>
            </ListItem>  
          </Grid>
          <Grid item>
            <ListItem button>
              <ListItemText primary="Load metadata" secondary="Load data from sharepoint api" onClick={() => {getDelta()}}/>
            </ListItem>  
          </Grid>
        </Grid>


        <Grid container spacing={3}>
          <Grid item>
          <ListItem button>
          <ListItemText primary="Get countries" onClick={() => {loadCountries()}}/>
        </ListItem>  
          </Grid>
          <Grid item>
          <ListItem button>
          <ListItemText primary="Get whitelists" onClick={() => {loadWhitelists()}}/>
        </ListItem> 
          </Grid>
          <Grid item>
          <ListItem button>
          <ListItemText primary="Load last modified date" secondary={state.lastModifiedDateTime} onClick={() => {loadLastModifiedDate()}}/>
        </ListItem> 
            </Grid>

            <Grid item>
          <ListItem>
          <ListItemText primary="Should show update alert?" secondary={state.showUpdateAlert ?? false}/>
        </ListItem> 
            </Grid>
        </Grid>
        

         

        <Grid container spacing={3}>
          <Grid item>
            <ListItem button disabled={state.version !== "light"}>
              <ListItemText primary="Load Lighstore Dev" onClick={() => {loadLighStore()}}/>
            </ListItem>  
          </Grid>
          <Grid item>
            <ListItem button disabled={state.version !== "flex"}>
              <ListItemText primary="Load FlexStore" onClick={() => {loadFlexStore()}}/>
            </ListItem>
          </Grid>
        </Grid>
          <ListItem button>
            <ListItemText primary="Load Linked Store for 02 6008 Care System (AUT)" onClick={() => {loadLinkedStore()}}/>
          </ListItem>

          <Grid container spacing={3}>
          <Grid item>
          <ListItem>
            <ListItemText primary="Selected Country and Version" secondary={`${state.selectedCountry} / ${state.version} `} />
          </ListItem>  
          </Grid>
            <Grid item>
              <FormControl >
                <InputLabel>Country</InputLabel>
                <Select value={state.selectedCountry} onChange={(e) => { selectedCountry(e.target.value as string ?? "")}}> 
                { state.countries.map(country => <MenuItem key="country" value={country}>{country}</MenuItem>)}
                </Select>
              </FormControl>
          </Grid>
        
          </Grid>

          <Grid container>
          <Grid item>
          <ListItem button>
            <ListItemText primary="Download test file" secondary="Will be saved to home/oneappdesktop/" onClick={() => {downloadTestFile()}}/>
          </ListItem>
            </Grid>
            <Grid item></Grid>  
          </Grid> 
     

        </div>
      </main>
       <LoadingDialog open={state.isLoading}></LoadingDialog>
      </Fragment>
    );
}



export default DevSettings;