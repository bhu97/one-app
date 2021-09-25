import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Input, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { getAssetPath } from '../../../helpers';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { PageHeader } from 'renderer/components/atoms';
import { FileList } from 'renderer/components/molecules';
import { FavoriteStore } from 'renderer/database/stores/FavoriteStore';
import { db } from 'renderer/database/database';



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
  items: {name: string, id: number}[]
  onAdd: () => void
  selectedItem?: (name:string) => void
  editItem?: (id:number, name:string) => void
  deleteItem?: (id:number, name:string) => void
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
            return <ListItem button key={item.id} onClick={()=>{props.selectedItem?.(item.name)}}>
              <ListItemText>
                {item.name}
              </ListItemText>
              <ListItemSecondaryAction>
                <IconButton aria-label="edit" onClick={()=>{props.editItem?.(item.id, item.name)}}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={()=>{props.deleteItem?.(item.id, item.name)}}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          })
        }
      </List>
    </CardContent>
   
  </Card>)
}
type InputDialogProps = { 
  handleClose: () => void,
  handleOk: (params: {id?: number, name:string}) => void,
  title: string,
  description: string,
  open:boolean,
  params?: any
}

const InputDialog:FC<InputDialogProps> = ({handleClose, handleOk, title, description, open, params}) => {
  const [text, setText] = useState(params?.name ?? "")
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
          <Button onClick={() => {handleOk({id:params?.id, name:text})}} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
  )
}
type FavoritesPageProps = {
 
};
export const FavoritesPage: FC<FavoritesPageProps> = () => {

  const [favoriteGroups, setFavoriteGroups] = useState(Array<{name: string, id: number}>())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedGroupToEdit, setSelectedGroupToEdit] = useState({})
  const [favoriteStore, setFavoriteStore] = useState(new FavoriteStore({}))

  const getData = async() => {
    let names = await favoriteStore.getAllFavoriteGroups()
    setFavoriteGroups(names)
  }

  const updateStore = async() => {
    const store = new FavoriteStore({query: selectedGroup})
    await store.update()
    setFavoriteStore(store)
  }

  const onAdd = () => {
    setShowCreateDialog(true)
  }

  const selectedItem = async(name: string) => {
    console.log("selected group "+ name);
    if(name && name.length > 0) {
      setSelectedGroup(name)
      await updateStore()
    }
  }

  const editItem = async(id:number, name: string) => {
    setSelectedGroupToEdit({id: id, name: name})
    setShowEditDialog(true)
  }

  const deleteItem = async(id:number, name: string) => {
    await favoriteStore.removeFavoriteGroup(name)
  }

  const addNewGroup = async(name: string) => {
    if(name.length > 0) {
      await favoriteStore.addFavoriteGroup(name)
      await getData()
    }
  }

  const renameGroup = async(id: number, name: string) => {
    if(name.length > 0) {
      await favoriteStore.renameFavoriteGroup(id, name)
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
      
      <FavoriteGroupList items={favoriteGroups} onAdd={onAdd} selectedItem={selectedItem} editItem={editItem} deleteItem={deleteItem}/>
        <FileList items={favoriteStore.items} thumbnails={[]}></FileList>
      </div>
    </div>
    <InputDialog open={showCreateDialog} handleClose={()=>{setShowCreateDialog(false)}} handleOk={(params)=>{setShowCreateDialog(false); addNewGroup(params.name)}} title={"Create new group"} description={"Enter a name"}></InputDialog>
    <InputDialog open={showEditDialog} handleClose={()=>{setShowEditDialog(false)}} handleOk={(params)=>{setShowEditDialog(false); if(params.id){renameGroup(params.id, params.name)}}} title={"Rename Group"} description={"Enter a name"} params={selectedGroupToEdit}></InputDialog>
  </Fragment>)
};



export default FavoritesPage;
