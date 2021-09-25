import { makeStyles } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { PageHeader } from '../../atoms';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
}));

interface IPageStructureProps {
  headerTitle?: string;
  headerDescription?: string;
  headerImage?: string;
  main: JSX.Element;
  column?: JSX.Element;
  isColumnOnLeft?: boolean;
}

export const PageStructure: FC<IPageStructureProps> = ({
  headerTitle,
  headerDescription,
  headerImage,
  main,
  column,
  isColumnOnLeft,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <PageHeader
        title={headerTitle}
        description={headerDescription}
        image={headerImage}
      />
      <div className={styles.wrapper}>
        {isColumnOnLeft ? column : undefined}
        {main}
        {isColumnOnLeft ? undefined : column}
      </div>
    </div>
  );
};

export default PageStructure;
