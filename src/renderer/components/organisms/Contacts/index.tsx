import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { EmailIcon } from '../../../svg';
import { RightMenuBox, RightMenuItem } from '../../atoms';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0),
  },
}));

export const Contacts: FC = () => {
  const styles = useStyles();

  return (
    <RightMenuBox title="Contacts" isColumnOnLeft>
      <Typography variant="h3" className={styles.title}>
        Content & permission support
      </Typography>
      <RightMenuItem
        key="content"
        text="Contact"
        icon={EmailIcon}
        slim
        onClick={() => {
          window.location.href =
            'mailto:oneapp@fmc-ag.com?subject=One Feedback';
        }}
      />
      <Typography variant="h3" className={styles.title}>
        Technical support
      </Typography>
      <RightMenuItem
        key="technical"
        text="Contact"
        icon={EmailIcon}
        slim
        onClick={() => {
          window.location.href =
            'mailto:globalservicedesk@fresenius.com?subject=One App Support';
        }}
      />
    </RightMenuBox>
  );
};

export default Contacts;
