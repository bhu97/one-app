import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import headerImage from '../../../../../assets/favorites/200921_FMC_OneApp_Illustrationen_Final_Favourites.png';
import { FileCommands } from '../../../enums';
import { useFavourites } from '../../../helpers';
import { DocsIcon } from '../../../svg';
import { RightMenuBox, RightMenuItem } from '../../atoms';
import { FileList } from '../../molecules';
import { PageStructure } from '../../templates';

const useStyles = makeStyles((theme) => ({}));

export const FavoritesPage: FC = () => {
  const styles = useStyles();
  const {
    currentFavoriteGroup,
    items,
    thumbnails,
    favoriteGroups,
    updateItems,
    selectFavouriteGroup,
  } = useFavourites();

  return (
    <PageStructure
      headerTitle="Favourites"
      headerDescription="Create your own favourite lists and save documents in them"
      headerImage={headerImage}
      main={
        <FileList
          items={items}
          availableCommands={[
            FileCommands.AddToShoppingCart,
            FileCommands.AddRemoveFavourite,
          ]}
          onFavouriteChange={updateItems}
          thumbnails={thumbnails}
          title={currentFavoriteGroup}
        />
      }
      isColumnOnLeft
      column={
        <RightMenuBox title="Your favourite lists" isColumnOnLeft>
          {favoriteGroups.map((favoriteGroup) => (
            <RightMenuItem
              key={favoriteGroup.id}
              text={favoriteGroup.name}
              icon={DocsIcon}
              onClick={() => selectFavouriteGroup(favoriteGroup.name)}
            />
          ))}
        </RightMenuBox>
      }
    />
  );
};

export default FavoritesPage;
