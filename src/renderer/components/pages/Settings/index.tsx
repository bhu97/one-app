import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import headerImage from '../../../../../assets/settings/201015_FMC_OneApp_Illustrationen_Final_Settings.png';
import { EmailIcon } from '../../../svg';
import { RightMenuBox, RightMenuItem } from '../../atoms';
import { PageStructure } from '../../templates';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2, 4),
    background: theme.palette.background.paper,
    boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0),
  },
  separator: {
    borderColor: theme.palette.primary.main,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
  },
}));

export const SettingsPage: FC = () => {
  const styles = useStyles();

  return (
    <PageStructure
      headerTitle="Settings"
      headerDescription="One App settings and contact information"
      headerImage={headerImage}
      main={
        <div className={styles.root}>
          <Typography variant="h2">App information</Typography>
          <div className={styles.separator} />
          <Typography variant="h2">Content Updates</Typography>
        </div>
      }
      isColumnOnLeft
      column={
        <RightMenuBox title="Contacts" isColumnOnLeft>
          <Typography variant="h3" className={styles.title}>
            Content & permission support
          </Typography>
          <RightMenuItem
            key="content"
            text="Contact"
            icon={EmailIcon}
            onClick={console.log}
          />
          <Typography variant="h3" className={styles.title}>
            Technical support
          </Typography>
          <RightMenuItem
            key="technical"
            text="Contact"
            icon={EmailIcon}
            onClick={console.log}
          />
        </RightMenuBox>
      }
    />
  );
};

export default SettingsPage;
