import React, { FC } from 'react';

import headerImage from '../../../../../assets/settings/201015_FMC_OneApp_Illustrationen_Final_Settings.png';
import { AppSettings, Contacts } from '../../organisms';
import { PageStructure } from '../../templates';

export const SettingsPage: FC = () => {
  return (
    <PageStructure
      headerTitle="Settings"
      headerDescription="One App settings and contact information"
      headerImage={headerImage}
      main={<AppSettings />}
      isColumnOnLeft
      column={<Contacts />}
    />
  );
};

export default SettingsPage;
