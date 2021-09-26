import { makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { EmailIcon } from '../../../svg';
import { LoadingDialog, RightMenuItem } from '../../atoms';
import { useAppSettings } from './useAppSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2, 4),
    background: theme.palette.background.paper,
    boxShadow: `0 0 4px 3px ${theme.palette.grey[300]}, 0 0.3px 0.9px 0 rgb(168 0 0 / 54%)`,
  },
  separator: {
    margin: theme.spacing(3, 0),
    borderColor: theme.palette.primary.main,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  column: {
    flexBasis: '33%',
    display: 'flex',
    flexDirection: 'column',
  },
  columnMiddle: {
    margin: theme.spacing(0, 2),
    flexGrow: 1,
  },
  columnLast: {
    alignItems: 'flex-end',
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  select: {
    background: 'none !important',
    padding: '0 !important',
  },
  icon: {
    display: 'none',
  },
  light: {
    color: theme.palette.grey[600],
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
}));

export const AppSettings: FC = () => {
  const styles = useStyles();
  const {
    isLoading,
    onCountrySelected,
    countries,
    selectedCountry,
    countryVersion,
    appVersion,
    modifiedDate,
    onUpdateNow,
  } = useAppSettings();

  return (
    <div className={styles.root}>
      <Typography variant="h2" classes={{ h2: styles.title }}>
        App information
      </Typography>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <Typography variant="h3">User Country</Typography>
          <Select
            value={selectedCountry}
            classes={{
              select: styles.select,
              icon: styles.icon,
            }}
            onChange={(e) => {
              onCountrySelected((e.target.value as string) ?? '');
            }}
            renderValue={(value) => (
              <RightMenuItem text={value as string} icon={EmailIcon} slim />
              // TODO wrong icon */}
            )}
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={[styles.column, styles.columnMiddle].join(' ')}>
          <Typography variant="h3">Country Version</Typography>
          <div className={styles.light}>{countryVersion}</div>
        </div>
        <div className={[styles.column, styles.columnLast].join(' ')}>
          <Typography variant="h3">App Version</Typography>
          <div className={styles.light}>{appVersion}</div>
        </div>
      </div>
      <div className={styles.separator} />
      <Typography variant="h2" classes={{ h2: styles.title }}>
        Content Updates
      </Typography>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <Typography variant="h3">Online Content</Typography>
          <div>
            <RightMenuItem
              text="Update now"
              icon={EmailIcon}
              slim
              onClick={onUpdateNow}
            />{' '}
            {/* TODO wrong icon */}
          </div>
        </div>
        <div className={[styles.column, styles.columnLast].join(' ')}>
          <Typography variant="h3">Modified date</Typography>
          <div className={styles.light}>{modifiedDate}</div>
        </div>
      </div>
      <LoadingDialog open={isLoading} />
    </div>
  );
};

export default AppSettings;