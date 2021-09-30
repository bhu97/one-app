import { Button, makeStyles, Menu, MenuItem } from '@material-ui/core';
import React, { FC, useRef, useState } from 'react';

import { TripleDot } from '../../../svg';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'transparent',
    minWidth: 'unset',
    '&:hover': {
      transform: 'unset',
    },
  },
}));

interface IDropdownMenuProps {
  commands: { title: string; onClick: () => void }[];
}

export const DropdownMenu: FC<IDropdownMenuProps> = ({ commands }) => {
  const styles = useStyles();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        ref={buttonRef}
        classes={{
          root: styles.button,
        }}
        onClick={(e) => {
          setIsOpen(true);
        }}
      >
        {TripleDot}
      </Button>
      <Menu
        anchorEl={buttonRef.current}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {commands.map((command) => (
          <MenuItem
            key={command.title}
            onClick={() => {
              command.onClick();
              setIsOpen(false);
            }}
          >
            {command.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;
