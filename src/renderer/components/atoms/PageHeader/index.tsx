import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    left: 0,
    marginBottom: theme.spacing(3),
    background: theme.palette.background.paper,
    minHeight: '150px',
    boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  textWrapper: {
    padding: theme.spacing(2, 4),
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  imageWrapper: {
    display: 'flex',
    flexBasis: '527px',
    flexShrink: 0,
    maxWidth: '70%',
    alignItems: 'flex-end',
  },
  image: {
    display: 'block',
    maxWidth: '100%',
  },
}));

interface IPageHeaderProps {
  title?: string;
  description?: string;
  image?: string;
}

export const PageHeader: FC<IPageHeaderProps> = ({
  title,
  description,
  image,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.textWrapper}>
        {title ? (
          <Typography variant="h1" classes={{ h1: styles.title }}>
            {title}
          </Typography>
        ) : null}
        {description ? (
          <Typography variant="h2">{description}</Typography>
        ) : null}
      </div>
      {image ? (
        <div className={styles.imageWrapper}>
          <img className={styles.image} src={image} alt="" />
        </div>
      ) : undefined}
    </div>
  );
};

export default PageHeader;
