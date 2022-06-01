import React, { FC, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import { dataManager } from '../../../DataManager';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'relative',
      width: 650,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #0B0E4A',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '87vh',
        display: 'flex',
        flexWrap: 'wrap',
      },
      button: {
        margin: theme.spacing(1),
      },
    },
  })
);

export default function SimpleModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Body');
  const [email, setEmail] = useState('');
  const emailSubjectRef = useRef('One Desktop App Attachments');
  const emailTextRef = useRef('Attaching the selected files');
  const [modalStyle] = React.useState(getModalStyle);

  let images = [];

  for (let index = 0; index < props.items; index++) {
    images.push('');
  }
  const addImages = images.map((im) => (
    <PictureAsPdfOutlinedIcon
      style={{ height: 30, marginRight: '2%', color: '#071B45' }}
    />
  ));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const sendEmail = async () => {
    let res = await dataManager.sendCartMail(
      email.split(','),
      emailSubjectRef.current,
      emailTextRef.current
    );
    props.setClose();
    console.log('result', res);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <CloseTwoToneIcon
        style={{ marginLeft: '96%' }}
        onClick={props.setClose}
      />

      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.root}>
          <TextField
            id="filled-full-width"
            label="To"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mail@mail.com"
          />
          <TextField
            id="filled-full-width"
            label="Subject"
            placeholder="One Desktop App Attachments"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <p>Attachments</p>
          <span>{addImages}</span>

          <TextField
            id="outlined-multiline-flexible"
            multiline
            maxRows={4}
            // value={value}
            onChange={handleChange}
            placeholder="Attaching the selected files"
            variant="outlined"
            rows={4}
          />

          <div>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              className={classes.button}
              endIcon={<SendTwoToneIcon />}
              style={{ marginLeft: '80%' }}
              onClick={sendEmail}
            >
              Send
            </Button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <Modal open={props.open} onClose={props.setClose}>
        {body}
      </Modal>
    </div>
  );
}
