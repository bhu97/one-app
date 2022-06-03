import React, { FC, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {Modal, TextField, Button, Popover}from '@material-ui/core';
// import  from '@material-ui/core/TextField';
// import  from '@material-ui/core/Button';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import { dataManager } from '../../../DataManager';
// import  from '@material-ui/core/Popover';

function rand() {
  return Math.round(Math.random() * 30) - 10;
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
      position: 'absolute',
      width: 'auto',
      height: 'auto',
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
    popover: {
      pointerEvents: 'none',
    },
  })
);

export default function SimpleModal(props) {
  const classes = useStyles();
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState('');
  //  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [email, setEmail] = useState('');
  const [emailSubjectRef, setEmailSubjectRef] = useState('');
  const [emailTextRef, setEmailTextRef] = useState('');
  const [modalStyle] = React.useState(getModalStyle);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  console.log('iteemsss', props.items);
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    name
  ) => {
    setAnchorEl(event.currentTarget);
    setValue(name);
  };

  const handlePopoverClose = (e, name) => {
    setAnchorEl(null);
    setValue(name);
  };

  const open = Boolean(anchorEl);
  const addImages = props.items.map((im, i) => (
    <div key={i}>
      <PictureAsPdfOutlinedIcon
        style={{ height: 30, marginRight: '2%', color: '#071B45' }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={(e) => handlePopoverOpen(e, im.name)}
        onMouseLeave={(e) => handlePopoverClose(e, im.name)}
      />
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <p>{value}</p>
      </Popover>
    </div>
  ));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const emailRegex = /\S+@\S+\.\S+/;

  const validateEmail = (e) => {
    const email = e.target.value;

    if (emailRegex.test(email)) {
      setIsValid(true);
      setMessage('Your email looks good!');
    } else {
      setIsValid(false);
      setMessage('Please enter a valid email!');
    }
  };


  const sendEmail = async () => {
    let res = await dataManager.sendCartMail(
      email.split(','),
      emailSubjectRef,
      emailTextRef
    );
    props.setClose();
    console.log('result', res);
    setEmail("")
  };

  const closeModal = () => {
    props.setClose();
    setEmail('');
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <CloseTwoToneIcon style={{ marginLeft: '96%' }} onClick={closeModal} />

      <form className={classes.root} noValidate autoComplete="off">
        <div className={classes.root}>
          <TextField
            id="filled-full-width"
            label="To"
            style={{ margin: 8 }}
            // fullWidth
            required={true}
            // margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={email}
            variant="outlined"
            onChange={(e) => {
              setEmail(e.target.value), validateEmail(e);
            }}
            // (e) => setEmail(e.target.value)

            placeholder="mail@mail.com"
            // helperText={message}
          />

          {email.length > 0 && (
            <p style={{ color: isValid ? 'green' : 'red' }}>{message}</p>
          )}
          <TextField
            id="filled-full-width"
            label="Subject"
            required={true}
            placeholder="One Desktop App Attachments"
            style={{ margin: 8 }}
            // fullWidth
            // margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            onChange={(e) => setEmailSubjectRef(e.target.value)}
          />
          <p>Attachments</p>
          <span>{addImages}</span>

          <TextField
            id="outlined-multiline-flexible"
            multiline
            maxRows={4}
            // value={value}
            onChange={(e) => setEmailTextRef(e.target.value)}
            placeholder="Attaching the selected files"
            variant="outlined"
            required={true}
            minRows={4}
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
              disabled={!isValid  || !emailSubjectRef || !emailTextRef}
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
