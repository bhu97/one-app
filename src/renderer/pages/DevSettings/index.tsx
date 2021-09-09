import { Button, Card, CardActions, CardContent, ListItem, ListItemText, makeStyles, Typography} from '@material-ui/core';

import React, { FC, Fragment, useEffect, useState } from 'react';
import Sidebar from 'renderer/components/ui/Sidebar';


import { LoadingDialog } from 'renderer/components/ui/Loading';

import { AuthenticationResult } from '@azure/msal-node';
import {fetchAdditionalMetadata, fetchDelta} from './../../../authentication/fetch'
import { db } from 'database/database';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: theme.palette.primary.main
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
  token: string
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
  }, [])
  const classes = useStyles();
  const [state, setState] = useState({isLoading: false, token: ""})

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

      //FETCH DETLA
      let deltaData = await fetchDelta(token);
      console.log(deltaData);
      await db.save(deltaData);

      //FETCH METADATA
      let metaData = await fetchAdditionalMetadata(token);
      await db.saveMetaData(metaData);

      //CREATE USER
      //SET COUNTRY/VERSION

      //FETCH WHITELISTS
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
            <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card> 
        
        <ListItem button>
          <ListItemText primary="Login" secondary="nothing here" onClick={() => {login()}}/>
        </ListItem>

        <ListItem button>
          <ListItemText primary="Get Token Silent" secondary={state.token} onClick={() => {refresh()}}/>
        </ListItem>        

        <ListItem button>
          <ListItemText primary="Get delta" onClick={() => {getDelta()}}/>
        </ListItem>   

        <ListItem button>
          <ListItemText primary="Save" onClick={() => {save()}}/>
        </ListItem>   
        </div>
      </main>
       <LoadingDialog open={state.isLoading}></LoadingDialog>
      </Fragment>
    );
}



export default DevSettings;