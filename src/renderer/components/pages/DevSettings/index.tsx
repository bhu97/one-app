import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

import React, { FC, Fragment, useEffect, useState } from 'react';
import { Sidebar } from '../../organisms';

import { LoadingDialog } from '../../atoms';

import { AuthenticationResult } from '@azure/msal-node';
import {
  fakeFetchWhitelists,
  fetchAdditionalMetadata,
  fetchDelta,
  fetchDriveItem,
  fetchLastModifiedDate,
  fetchWhitelists,
} from '../../fetch';
import { CountryVersion, db, DriveItem } from 'renderer/database/database';
import { LightStore } from 'renderer/database/stores/LightStore';
import { responseToDriveItem, responseToListItem } from '../../../utils/object.mapping';
import { FlexStore } from 'renderer/database/stores/FlexStore';
import { LinkedStore } from 'renderer/database/stores/LinkedStore';
import { localStorgeHelper } from 'renderer/database/storage';
import dayjs from 'dayjs';
import { AppError, dataManager } from '../../../DataManager';
import { cartStore } from 'renderer/database/stores/CartStore';
import { FlexLightStoreFactory } from 'renderer/database/stores/FlexLightStoreFactory';
import config from 'renderer/utils/application.config.release'

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
  lastModifiedDateTime?: string;
  showUpdateAlert?: boolean;
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

    async () => {
      await loadCurrentUser();
      await loadCountries();
      setState({
        ...state,
        showUpdateAlert: localStorgeHelper.shouldShowUpdateAlert(),
      });
    };
  }, []);
  const classes = useStyles();
  const [state, setState] = useState<DevSettingsState>({
    isLoading: false,
    token: '',
    countries: [],
    selectedCountry: '',
    version: 'none',
    lastModifiedDateTime: localStorgeHelper.getLastModifiedDate() ?? '',
    showUpdateAlert: localStorgeHelper.shouldShowUpdateAlert(),
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

  // const getDelta = async () => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setState({ ...state, isLoading: true });
  //     try {
  //       //FETCH DETLA
  //       let deltaData = await fetchDelta(token);
  //       console.log(deltaData);
  //       await db.save(deltaData);

  //       //FETCH METADATA
  //       let metaData = await fetchAdditionalMetadata(token);
  //       await db.saveMetaData(metaData);

  //       //CREATE USER
  //       //SET COUNTRY/VERSION
  //       await db.createUserIfEmpty();

  //       await db.setupInitialFavoriteGroup();

  //       const whitelistDriveItems = await db.getAllWhitelists();
  //       let whitelists = await fetchWhitelists(whitelistDriveItems, token);
  //       await db.saveWhitelists(whitelists);

  //       localStorgeHelper.setLastMetdataUpdate();
  //       setState({ ...state, isLoading: false });

  //       //FETCH WHITELISTS
  //     } catch (error) {
  //       console.log(error);
  //       setState({ ...state, isLoading: false });
  //     }
  //   }
  // };

  const getDelta = async () => {
    setState({ ...state, isLoading: true });
    let result = await dataManager.getMetaData((state) =>
      console.log('loading ' + state)
    );
    setState({ ...state, isLoading: false });
    if (result as boolean) {
      console.log('result: ' + result);
    }
    console.log('result: ' + result);
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
    if (token) {
      const whitelistDriveItems = await db.getAllWhitelists();
      let whitelists = await fetchWhitelists(whitelistDriveItems, token);
      await db.saveWhitelists(whitelists);
      console.log(whitelists);
    }
  };

  const setupDummyData = async () => {
    //if (await db.isEmpty()) {
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
      db.createUserIfEmpty()

      db.setupInitialFavoriteGroup();

      setState({ ...state, isLoading: false });
   // }
  };

  const loadLighStore = async () => {
    let store = await FlexLightStoreFactory.getStoreForCurrentUser()
    if(store) {
      await store.update()
      console.table(store.items.map(item => item.title ?? item.name));
    };
  };

  const loadFlexStore = async () => {
    let store = await FlexLightStoreFactory.getStoreForCurrentUser()
    if(store) {
      await store.update()
      console.log(store.items);
    }
  };

  const loadLinkedStore = async () => {
    let store = new LinkedStore({
      query: '01GX2IG4JQHK2LKOD6LFA3L54XT2KDUS5W',
    });
    await store.update();
    console.table(store.items.map(item => {return {"id": item.uniqueId, "name": item.name, "title": item.title, "country": item.country}}));
  };

  const loadThumbnails = async () => {
    let thumbnails = await dataManager.getThumbnails(
      '01GX2IG4KBBI3T2OYLYBFZGWRUKA2FXBWM'
    );
    console.log(thumbnails);
  };

  const loadLastModifiedDate = async () => {
    //const token = localStorage.getItem('token');
    const authResult = await window.electron.ipcRenderer.refreshTokenSilently();
    const token = authResult.accessToken;
    if (token) {
      const date = await fetchLastModifiedDate(token);
      console.log(date);
      localStorgeHelper.setLastModifiedDate(date);
      let showAlert = localStorgeHelper.shouldShowUpdateAlert();
      setState({
        ...state,
        lastModifiedDateTime: localStorgeHelper.getLastModifiedDate() ?? '',
        showUpdateAlert: showAlert,
      });
    }
  };

  const addSomeFavorites = async() => {
    const groupNames = await db.getAllFavoriteGroupNames()
    let driveItemIds = [
      '01GX2IG4P6QO77G3ADXZH3SMDM54ETHNPG',
      '01GX2IG4JYEJQTQI6Y65B2CVEUSFXILTVD',
      '01GX2IG4JWHVRXD6MAKNEJ6XLO5XFHQFCQ',
      '01GX2IG4O7AE7DKXCO4RAKXKHWI3RLDQUH',
    ];

    for (let groupName of groupNames) {
      const rnd = Math.floor(Math.random() * (driveItemIds.length-1));
      for(let i = 0; i<rnd; i++) {
        await db.addFavorite(driveItemIds[i], groupName)
      }
    }
  }

  const removeFavorites = async() => {

  }

  const downloadTestFile = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const driveItemId = '36066';
      const driveItem = await fetchDriveItem(driveItemId, token);
      //console.log(driveItem);

      if (driveItem && driveItem.graphDownloadUrl) {
        console.log(driveItem.graphDownloadUrl);
        let downloadItem = await window.electron.ipcRenderer.downloadFile({
          url: driveItem.graphDownloadUrl,
          itemId: driveItemId,
          directory: 'MODULES',
        });

        console.log(downloadItem);
        if (downloadItem) {
          db.updateDownloadLocationForDriveItem(
            driveItemId,
            `${downloadItem.savePath}/${downloadItem.fileName}`
          );

          let zipResponse = await window.electron.ipcRenderer.unzipFile({
            filePath: `${downloadItem.savePath}/${downloadItem.fileName}`,
          });

          console.log(zipResponse);
          if (zipResponse) {
            db.saveUnzippedItem({
              driveItemId: driveItemId,
              zipPath: `${downloadItem.savePath}/${downloadItem.fileName}`,
              targetPath: zipResponse.targetDir,
              modifiedDate: driveItem.timeLastModified ?? dayjs().toISOString(),
              uniqueId: driveItem.uniqueId,
              indexHtmlPath: zipResponse.indexHtmlPath,
            });
            let indexHtmlPath = await window.electron.ipcRenderer.findIndexHTML(
              {
                path: zipResponse.targetDir,
              }
            );
            console.log('index html path' + indexHtmlPath);
          }
        }
      }
    }
  };

  const openUnzippedModule = async () => {
    // let indexHtmlPath = await db.getUnzippedItemIndexPath('36066');
    // if (indexHtmlPath) {
    //   console.log('opening:' + indexHtmlPath);
    //   window.electron.ipcRenderer.openHTML(indexHtmlPath);
    // }
    const driveItem = await db.getItemForId(
      '01GX2IG4NLQILFUAXN2ZHJGAZYWZRHMXFX'
    );
    await dataManager.openDriveItem(driveItem.uniqueId);
  };

  const downloadFilesForSending = async () => {
    // let driveItemIds: string[] = [
    //   '36066',
    //   '36015',
    //   '735',
    //   '36014',
    //   '36013',
    //   '712',
    //   '713',
    // ];

    let driveItemIds = [
      '01GX2IG4P6QO77G3ADXZH3SMDM54ETHNPG',
      '01GX2IG4JYEJQTQI6Y65B2CVEUSFXILTVD',
      '01GX2IG4JWHVRXD6MAKNEJ6XLO5XFHQFCQ',
      '01GX2IG4O7AE7DKXCO4RAKXKHWI3RLDQUH',
    ];
    setState({ ...state, isLoading: true });
    cartStore.removeAll();
    driveItemIds.forEach((uniqueId) => cartStore.addDriveItem(uniqueId));

    await cartStore.update();

    console.log(cartStore.isFileSizeUnderMaximum())

    //await dataManager.downloadCartFiles();

    // try {
    //   for (let driveItemId of driveItemIds) {
    //     let downloadItem = await window.electron.ipcRenderer.downloadFile({
    //       url: '',
    //       itemId: driveItemId,
    //       directory: 'CART',
    //     });
    //   }

    //   window.electron.ipcRenderer.openCartFolder();
    // } catch (error) {
    //   console.log(error);
    // }
    setState({ ...state, isLoading: false });
  };

  const openAFile = async () => {
    const uniqueId = '01GX2IG4MP7ZMYQEVALFBLAL2N4OXU7WQS';
    await dataManager.openDriveItem(uniqueId);
  };

  return (
    <Fragment>
      <main className={classes.root}>

        <div className={classes.content}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h3" component="p">
                Developer Settings for testing
              </Typography>
              <Typography>
                App Version {config.APP_VERSION}
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Login"
                  secondary={state.token}
                  onClick={() => {
                    login();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Get Token Silent"
                  secondary={state.token}
                  onClick={() => {
                    refresh();
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Load dummy data"
                  secondary="Load local data"
                  onClick={() => {
                    setupDummyData();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Load metadata"
                  secondary="Load data from sharepoint api"
                  onClick={() => {
                    getDelta();
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Get countries"
                  onClick={() => {
                    loadCountries();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Get whitelists"
                  onClick={() => {
                    loadWhitelists();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Load last modified date"
                  secondary={state.lastModifiedDateTime}
                  onClick={() => {
                    loadLastModifiedDate();
                  }}
                />
              </ListItem>
            </Grid>

            <Grid item>
              <ListItem>
                <ListItemText
                  primary="Should show update alert?"
                  secondary={state.showUpdateAlert ? 'true' : 'false'}
                />
              </ListItem>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item>
              <ListItem button disabled={state.version !== 'light'}>
                <ListItemText
                  primary="Load Lighstore Dev"
                  onClick={() => {
                    loadLighStore();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button disabled={state.version !== 'flex'}>
                <ListItemText
                  primary="Load FlexStore"
                  onClick={() => {
                    loadFlexStore();
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>
          <ListItem button>
            <ListItemText
              primary="Load Linked Store for 02 6008 Care System (AUT)"
              onClick={() => {
                loadLinkedStore();
              }}
            />
          </ListItem>

          <Grid container spacing={3}>
            <Grid item>
              <ListItem>
                <ListItemText
                  primary="Selected Country and Version"
                  secondary={`${state.selectedCountry} / ${state.version} `}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel>Country</InputLabel>
                <Select
                  value={state.selectedCountry}
                  onChange={(e) => {
                    selectedCountry((e.target.value as string) ?? '');
                  }}
                >
                  {state.countries.map((country) => (
                    <MenuItem key="country" value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Download test file"
                  secondary="Will be saved to home/oneappdesktop/"
                  onClick={() => {
                    downloadTestFile();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Open unzipped file"
                  onClick={() => {
                    openUnzippedModule();
                  }}
                />
              </ListItem>
            </Grid>

            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Open a file"
                  onClick={() => {
                    openAFile();
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Download files for sending"
                  secondary="Will be saved to home/oneappdesktop/cart/"
                  onClick={() => {
                    downloadFilesForSending();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Open cart folder"
                  onClick={() => {
                    window.electron.ipcRenderer.openCartFolder();
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Get thumbnails"
                  onClick={() => {
                    loadThumbnails();
                  }}
                />
              </ListItem>
            </Grid>
            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Add random favorites"
                  secondary="Adds random favorites to all existing groups"
                  onClick={() => {
                    addSomeFavorites()
                  }}
                />
              </ListItem>
            </Grid>

            <Grid item>
              <ListItem button>
                <ListItemText
                  primary="Create user"

                  onClick={() => {
                    db.createUserIfEmpty()
                  }}
                />
              </ListItem>
            </Grid>
          </Grid>
        </div>
      </main>
      <LoadingDialog open={state.isLoading}></LoadingDialog>
    </Fragment>
  );
};

export default DevSettings;
