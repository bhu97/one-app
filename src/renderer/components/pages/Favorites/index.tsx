import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Input, List, ListItem, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { getAssetPath } from '../../../helpers';
import AddIcon from '@material-ui/icons/AddCircle';
import { PageHeader } from 'renderer/components/atoms';
import { FileList } from 'renderer/components/molecules';
import { FavoriteStore } from 'database/stores/FavoriteStore';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    height: 166,
    justifyContent: 'space-between'
  },
  image: {
    
  },
  favoriteGroupList: {
    width: 250,
    padding: 10,
    marginRight: theme.spacing(3)
  },
  favoriteGroupListTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
}));

const Header:FC = () => {
  const classes = useStyles()

  return (

<div>
  <Card className={classes.header}>
    <CardContent>
      <Typography variant="h1" component="p">
        Favourites
      </Typography>
      <Typography variant="h2" component="p">
        Create your own favourite lists <br/>
        and save documents in them
      </Typography>
    </CardContent>
    <img className={classes.image} src={getAssetPath(
            '../../../../../assets/favorites/200921_FMC_OneApp_Illustrationen_Final_Favourites.png' // TODO test if working for PROD
          )}></img>
  </Card>
  </div>)
}

type FavoriteGrouListProps = {
  items: {name: string}[]
  onAdd: () => void
  selectedItem?: (name:string) => void
}
const FavoriteGroupList: FC<FavoriteGrouListProps> = (props:FavoriteGrouListProps) => {
  const classes = useStyles()
  return (<Card className={classes.favoriteGroupList}>
    <CardContent>
      <div className={classes.favoriteGroupListTitle}>
        <Typography variant="h2">
          Your favourite lists
        </Typography>
        <IconButton onClick={props.onAdd}>
          <AddIcon fontSize="small"/>
        </IconButton>
      </div>
      <List>
        {
          props.items.map((item) => {
            return <ListItem button key={item.name} onClick={()=>{props.selectedItem?.(item.name)}}>
              <ListItemText>
                {item.name}
              </ListItemText>
            </ListItem>
          })
        }
      </List>
    </CardContent>
   
  </Card>)
}
type InputDialogProps = { 
  handleClose: () => void,
  handleOk: (name:string) => void,
  title: string,
  description: string,
  open:boolean
}

const InputDialog:FC<InputDialogProps> = ({handleClose, handleOk, title, description, open}) => {
  const [text, setText] = useState("")
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
          id="outlined-password-input"
          label="Group name"
          defaultValue={text}
          onChange={(e) => {setText(e.target.value)}}
        />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {handleOk(text)}} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
  )
}
type FavoritesPageProps = {
 
};
export const FavoritesPage: FC<FavoritesPageProps> = () => {

  const [favoriteGroups, setFavoriteGroups] = useState(Array<{name: string}>())
  const [showDialog, setShowDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [favoriteStore, setFavoriteStore] = useState(new FavoriteStore({}))

  const getData = async() => {
    let names = await favoriteStore.getAllFavoriteGroupNames()
    setFavoriteGroups(names.map((name) => {return {name: name}}))
  }

  const updateStore = async() => {
    const store = new FavoriteStore({query: selectedGroup})
    await store.update()
    setFavoriteStore(store)
  }

  const onAdd = () => {
    setShowDialog(true)
  }

  const selectedItem = async(name: string) => {
    console.log("selected group "+ name);
    if(name && name.length > 0) {
      setSelectedGroup(name)
      await updateStore()
    }
  }

  const addNewGroup = async(name: string) => {
    if(name.length > 0) {
      await favoriteStore.addFavoriteGroup(name)
      await getData()
    }

  }

  useEffect(() => {
    getData()
  })

//[{name: "Default"}, {name: "Test1"}]
  const styles = useStyles()
  return (<Fragment>
    <div className={styles.root}>  
    <PageHeader title="Favourites" description="Create your own favourite lists and save documents in them" />
    <div className={styles.wrapper}>
      
      <FavoriteGroupList items={favoriteGroups} onAdd={onAdd} selectedItem={selectedItem}/>
        <FileList items={favoriteStore.items} thumbnails={[]}></FileList>
      </div>
    </div>
    <InputDialog open={showDialog} handleClose={()=>{setShowDialog(false)}} handleOk={(name)=>{setShowDialog(false); addNewGroup(name)}} title={"Create new group"} description={"Enter a name"}></InputDialog>
  </Fragment>)
};



export default FavoritesPage;
