import { makeStyles } from '@material-ui/core';
import { toast } from 'material-react-toastify';
import React, { FC } from 'react';
import { useState } from 'react';

import headerImage from '../../../../../assets/favorites/200921_FMC_OneApp_Illustrationen_Final_Favourites.png';
import { FileCommands } from '../../../enums';
import { useFavourites } from '../../../helpers';
import { DocsIcon } from '../../../svg';
import { FavsCategoryDialog, RightMenuBox, RightMenuItem } from '../../atoms';
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
    addGroup,
  } = useFavourites();
  const [isDialog, setIsDialog] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const onClose = () => {
    setIsDialog(false);
    setEditedCategory('');
    setIsDialogLoading(false);
  };
  const onSave = async (groupName: string) => {
    try {
      setIsDialogLoading(true);
      await addGroup(groupName);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error(`Couldn't save ${groupName} list`);
    }
  };
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
              />
            ))}
          </RightMenuBox>
        }
      />
      {isDialog ? (
        <FavsCategoryDialog
          isDialogLoading={isDialogLoading}
          initialText={editedCategory || ''}
          isOpen={isDialog}
          onClose={onClose}
          title={editedCategory ? `Edit: ${editedCategory}` : 'New category'}
          onSave={onSave}
        />
      ) : undefined}
    </>
  );
};

export default FavoritesPage;
