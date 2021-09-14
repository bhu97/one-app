import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
  },
}));

type CartPageProps = {};
export const CartPage: FC<CartPageProps> = () => {
  const classes = useStyles();

  return (
    <>
      <Typography>Cart</Typography>
    </>
  );
};

export default CartPage;
