import { toast } from 'material-react-toastify';
import { useState } from 'react';

import { IFavoriteGroup } from '../../../database/database';

export const useFavouritesDialog = ({
  addGroup,
  renameGroup,
}: {
  addGroup: (groupName: string) => Promise<void>;
  renameGroup: (id: number, groupName: string) => Promise<void>;
}) => {
  const [isDialog, setIsDialog] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [editedCategory, setEditedCategory] = useState<IFavoriteGroup | null>(
    null
  );
  const onClose = () => {
    setIsDialog(false);
    setEditedCategory(null);
    setIsDialogLoading(false);
  };
  const onSave = async (groupName: string) => {
    try {
      setIsDialogLoading(true);
      if (editedCategory) {
        await renameGroup(editedCategory.id, groupName);
      } else {
        await addGroup(groupName);
      }
      onClose();
    } catch (e) {
      console.error(e);
      toast.error(`Couldn't save ${groupName} list`);
    }
  };
  return {
    isDialog,
    isDialogLoading,
    editedCategory,
    onSave,
    onClose,
    setIsDialog,
    setEditedCategory,
  };
};

export default useFavouritesDialog;
