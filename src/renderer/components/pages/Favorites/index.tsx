import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { useRef } from 'react';

import headerImage from '../../../../../assets/favorites/200921_FMC_OneApp_Illustrationen_Final_Favourites.png';
import { FavoriteStore } from '../../../database/stores/FavoriteStore';
import { useGetFilesData } from '../../../helpers';
import { DocsIcon } from '../../../svg';
import { RightMenuBox, RightMenuItem } from '../../atoms';
import { FileList } from '../../molecules';
import { PageStructure } from '../../templates';

const useStyles = makeStyles((theme) => ({}));

export const FavoritesPage: FC = () => {
  const styles = useStyles();
  const favoriteStoreRef = useRef(new FavoriteStore({}));
  const { items, thumbnails } = useGetFilesData(favoriteStoreRef.current, ''); // TODO id for thumbnails?

  return (
    <PageStructure
      headerTitle="Favourites"
      headerDescription="Create your own favourite lists and save documents in them"
      headerImage={headerImage}
      main={
        <FileList
          items={items}
          thumbnails={thumbnails}
          title="All added documents"
        />
      }
      isColumnOnLeft
      column={
        <RightMenuBox title="Your favourite lists" isColumnOnLeft>
          <RightMenuItem
            key="send"
            text="Send via e-mail"
            icon={DocsIcon}
            onClick={console.log}
          />
        </RightMenuBox>
      }
    />
  );
};

export default FavoritesPage;
