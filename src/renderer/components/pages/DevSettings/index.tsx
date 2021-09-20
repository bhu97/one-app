import { AuthenticationResult } from '@azure/msal-node';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { CountryVersion, db } from 'database/database';
import { FlexStore } from 'database/stores/FlexStore';
import { LightStore } from 'database/stores/LightStore';
import { LinkedStore } from 'database/stores/LinkedStore';
import React, { FC, useEffect, useState } from 'react';
import { responseToDriveItem, responseToListItem } from 'utils/object.mapping';

import { fakeFetchWhitelists, fetchAdditionalMetadata, fetchDelta } from '../../../../authentication/fetch';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    color: theme.palette.primary.main,
    overflow: 'auto',
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
    margin: '1em',
  },
}));

type DevSettingsProps = {};

type DevSettingsState = {
  isLoading: boolean;
  token: string;
  countries: string[];
  selectedCountry: string;
  version: string;
};

export const DevSettings: FC<DevSettingsProps> = () => {
  const authResult: AuthenticationResult = {
    authority: '',
    uniqueId: 'string;',
    tenantId: 'string;',
    scopes: ['Read'],
    account: null,
    idToken: 'string;',
    idTokenClaims: {},
    accessToken: 'string;',
    fromCache: true,
    expiresOn: null,
    tokenType: 'string;',
  };

  useEffect(() => {
    //setupDummyData()
    loadCountries();
    loadCurrentUser();
  }, []);
  const classes = useStyles();
  const [state, setState] = useState<DevSettingsState>({
    isLoading: false,
    token: '',
    countries: [],
    selectedCountry: '',
    version: 'none',
  });

  const login = async () => {
    let token = await window.electron.ipcRenderer.login('');
    console.log('finished my login: ' + token);
  };

  const refresh = async () => {
    let result = await window.electron.ipcRenderer.refreshTokenSilently();
    localStorage.setItem('token', result.accessToken);
    console.log('token: ' + JSON.stringify(result));
  };

  const save = async () => {
    await saveAuthToStorage(authResult);
    console.log(await getAuthFromStorage());
  };

  const saveAuthToStorage = async (authorization: AuthenticationResult) => {
    return await localStorage.setItem(
      'authorization',
      JSON.stringify(authorization)
    );
  };

  const getAuthFromStorage = async (): Promise<AuthenticationResult | null> => {
    const result = await localStorage.getItem('authorization');
    if (result) {
      return (JSON.parse(result) as AuthenticationResult) ?? null;
    }
    return null;
  };

  const getDelta = async () => {
    const token = localStorage.getItem('token');
    if (token) {
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
        await db.createUserIfEmpty();

        //FETCH WHITELISTS
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadCountries = async () => {
    const allCountries = await db.getAllAvailableCountries();
    if (allCountries) {
      setState({ ...state, countries: allCountries });
    }
    console.log(allCountries);
  };

  const loadCurrentUser = async () => {
    const user = await db.getUser();
    if (user) {
      console.log(CountryVersion[parseInt(user.version)]);
      setState({
        ...state,
        version: CountryVersion[parseInt(user.version)],
        selectedCountry: user.country,
      });
    }
  };

  const selectedCountry = async (country: string) => {
    console.log('seleccted country: ' + country);
    setState({ ...state, selectedCountry: country });
    await db.selectCurrentCountry(country);
    await loadCurrentUser();
  };

  const loadWhitelists = async () => {
    const token = localStorage.getItem('token');
    //const whitelistUrls = await db.getAllWhitelistUrls()
    //console.log(whitelistUrls);

    //await window.electron.ipcRenderer.getWhitelists([])
    // if(token) {
    //   try {
    //     const whitelistUrls = await db.getAllWhitelistUrls()
    //     const responses = await fetchWhitelists(whitelistUrls, token)
    //     console.log(responses);
    //   }
    //   catch(error) {
    //     console.log(error);
    //   }
    // }
  };

  const setupDummyData = async () => {
    if (await db.isEmpty()) {
      setState({ ...state, isLoading: true });

      let deltaResponse = await fetch('./../../../assets/delta.json');
      let deltaResponseJson = await deltaResponse.json();
      //console.log(deltaResponseJson.value[0]);
      let driveItems = deltaResponseJson.value.map(responseToDriveItem);
      await db.save(driveItems);

      let listitemResponse = await fetch('./../../../assets/listitem.json');
      let listitemResponseJson = await listitemResponse.json();
      console.log(listitemResponseJson.value[0]);
      let listItems = listitemResponseJson.value.map(responseToListItem);
      await db.saveMetaData(listItems);

      const whitelists = await fakeFetchWhitelists();
      console.log(whitelists);
      db.saveWhitelists(whitelists);

      db.setupInitialFavoriteGroup();

      setState({ ...state, isLoading: false });
    }
  };

  const loadLighStore = async () => {
    let store = new LightStore({});
    await store.update();
    console.log('light', store.items);
  };

  const loadFlexStore = async () => {
    let store = new FlexStore({});
    await store.update();
    console.log('flex', store.items);
  };

  const loadLinkedStore = async () => {
    let store = new LinkedStore({
      query: '01GX2IG4JQHK2LKOD6LFA3L54XT2KDUS5W',
    });
    await store.update();
    console.log(store.items);
  };
  return (
    <>
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
        <ListItemText
          primary="Setup dummy data"
          onClick={() => {
            setupDummyData();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Login"
          secondary="nothing here"
          onClick={() => {
            login();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Get Token Silent"
          secondary={state.token}
          onClick={() => {
            refresh();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Get delta"
          onClick={() => {
            getDelta();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Save"
          onClick={() => {
            save();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Get countries"
          onClick={() => {
            loadCountries();
          }}
        />
      </ListItem>

      <ListItem button>
        <ListItemText
          primary="Get whitelists"
          onClick={() => {
            loadWhitelists();
          }}
        />
      </ListItem>

      <ListItem button disabled={state.version !== 'light'}>
        <ListItemText
          primary="Load Lighstore Dev"
          onClick={() => {
            loadLighStore();
          }}
        />
      </ListItem>

      <ListItem button disabled={state.version !== 'flex'}>
        <ListItemText
          primary="Load FlexStore"
          onClick={() => {
            loadFlexStore();
          }}
        />
      </ListItem>

      <ListItem button disabled={state.version !== 'flex'}>
        <ListItemText
          primary="Load Linked Store for 02 6008 Care System (AUT)"
          onClick={() => {
            loadLinkedStore();
          }}
        />
      </ListItem>

      <FormControl>
        <InputLabel id="demo-simple-select-label">Country</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={state.selectedCountry}
          onChange={(e) => {
            selectedCountry((e.target.value as string) ?? '');
          }}
        >
          {state.countries.map((country) => (
            <MenuItem value={country}>{country}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <ListItem>
        <ListItemText
          primary="Selected Country and Version"
          secondary={`${state.selectedCountry} / ${state.version} `}
        />
      </ListItem>
    </>
  );
};

export default DevSettings;