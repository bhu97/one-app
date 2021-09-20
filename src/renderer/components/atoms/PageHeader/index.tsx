import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 4),
    background: theme.palette.background.paper,
    minHeight: '150px',
    boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
}));

interface IPageHeaderProps {
  title?: string;
  description?: string;
}

export const PageHeader: FC<IPageHeaderProps> = ({ title, description }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      {title ? (
        <Typography variant="h1" classes={{ h1: styles.title }}>
          {title}
        </Typography>
      ) : null}
      {description ? <Typography variant="h2">{description}</Typography> : null}
    </div>
  );
};

export default PageHeader;
