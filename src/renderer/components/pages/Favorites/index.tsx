import { makeStyles } from '@material-ui/core';
import React, { FC, useState } from 'react';

import headerImage from '../../../../../assets/favorites/200921_FMC_OneApp_Illustrationen_Final_Favourites.png';
import { FileCommands } from '../../../enums';
import { useFavourites } from '../../../helpers';
import { DocsIcon } from '../../../svg';
import { FavsCategoryDialog, RightMenuBox, RightMenuItem } from '../../atoms';
import { FileList } from '../../molecules';
import { PageStructure } from '../../templates';
import { useFavouritesDialog } from './useFavouritesDialog';

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
    addGroup,
    renameGroup,
    removeGroup,
  } = useFavourites();
  const {
    isDialog,
    isDialogLoading,
    editedCategory,
    onSave,
    onClose,
    setIsDialog,
    setEditedCategory,
  } = useFavouritesDialog({ addGroup, renameGroup });
  return (
    <>
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
          <RightMenuBox
            title="Your favourite lists"
            isColumnOnLeft
            onPlusClick={() => setIsDialog(true)}
          >
            {favoriteGroups.map((favoriteGroup) => (
              <RightMenuItem
                key={favoriteGroup.id}
                text={favoriteGroup.name}
                icon={DocsIcon}
                onClick={() => selectFavouriteGroup(favoriteGroup.name)}
                commands={
                  favoriteGroup.name === 'Default'
                    ? undefined
                    : [
                        {
                          title: 'Rename',
                          onClick: () => {
                            setIsDialog(true);
                            setEditedCategory(favoriteGroup);
                          },
                        },
                        {
                          title: 'Remove',
                          onClick: () => removeGroup(favoriteGroup.name),
                        },
                      ]
                }
              />
            ))}
          </RightMenuBox>
        }
      />
      {isDialog ? (
        <FavsCategoryDialog
          isDialogLoading={isDialogLoading}
          initialText={editedCategory ? editedCategory.name : ''}
          isOpen={isDialog}
          onClose={onClose}
          title={
            editedCategory ? `Edit: ${editedCategory.name}` : 'New category'
          }
          onSave={onSave}
        />
      ) : undefined}
    </>
  );
};

export default FavoritesPage;
