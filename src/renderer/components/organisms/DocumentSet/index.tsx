import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import { IDriveItem } from '../../../../database/database';
import { PageHeader } from '../../atoms';
import { FileList } from '../../molecules';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

interface IDocumentSetProps {
  documentSet: IDriveItem;
}

export const DocumentSet: FC<IDocumentSetProps> = ({ documentSet }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <PageHeader title={documentSet.title} description={documentSet.name} />
      <div>
        <FileList items={[{}, {}]} />
      </div>
    </div>
  );
};

export default DocumentSet;
