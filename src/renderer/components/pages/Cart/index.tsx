import { makeStyles } from '@material-ui/core';
import React, { FC, useState } from 'react';

import headerImage from '../../../../../assets/cart/200921_FMC_OneApp_Illustrationen_Final_Documents.png';
import { cartStore } from '../../../database/stores/CartStore';
import { dataManager } from '../../../DataManager';
import { FileCommands } from '../../../enums';
import { getFileSizeLiteral, useGetFilesData } from '../../../helpers';
import { DatabaseIcon, DocsIcon, EmailIcon, TrashIcon } from '../../../svg';
import { useTracking } from '../../../useTracking';
import { LoadingDialog, RightMenuBox, RightMenuItem } from '../../atoms';
import { FileList } from '../../molecules';
import { PageStructure } from '../../templates';

const useStyles = makeStyles((theme) => ({
  rightColumn: {
    flexBasis: '300px',
  },
  divider: {
    marginBottom: theme.spacing(3),
    maxHeight: 0,
  },
}));

export const CartPage: FC = () => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { items, thumbnails, updateItems } = useGetFilesData(cartStore);
  const {trackSendFiles} = useTracking()
  var country: string | undefined 
  if(items.length > 0) {
    country = items[0].country
  }

  return (
    <>
      <PageStructure
        headerTitle="Shopping cart"
        headerDescription="The documents can be sent directly by email from the shopping cart"
        headerImage={headerImage}
        main={
          <FileList
            items={items}
            availableCommands={[
              FileCommands.RemoveFromShoppingCart,
              FileCommands.AddRemoveFavourite,
            ]}
            onCartChange={updateItems}
            thumbnails={thumbnails}
            title="All added documents"
          />
        }
        column={
          <div className={styles.rightColumn}>
            <RightMenuBox title="Options">
              <RightMenuItem
                key="send"
                text="Download and send via e-mail"
                icon={EmailIcon}
                onClick={async () => {
                  setIsLoading(true);
                  setLoadingMessage('Downloading files');
                  await dataManager.downloadCartFiles();
                  trackSendFiles(items.map(item=>item.name ?? ""), country)
                  setIsLoading(false);
                }}
              />
              <RightMenuItem
                key="remove"
                text="Remove all Files"
                icon={TrashIcon}
                onClick={async () => {
                  setIsLoading(true);
                  setLoadingMessage('Removing files from cart');
                  cartStore.removeAll();
                  await updateItems();
                  setIsLoading(false);
                }}
              />
            </RightMenuBox>
            <div className={styles.divider} />
            <RightMenuBox title="Info">
              <RightMenuItem
                key="total"
                text={`Total size
              ${getFileSizeLiteral(
                cartStore.fileSizes
              )}\u00A0/\u00A0${getFileSizeLiteral(cartStore.fileSizeLimit)}`}
                icon={DatabaseIcon}
              />
              <RightMenuItem
                key="count"
                text={`Number of files ${cartStore.items.length}`}
                icon={DocsIcon}
              />
            </RightMenuBox>
          </div>
        }
      />
      <LoadingDialog open={isLoading} message={loadingMessage} />
    </>
  );
};

export default CartPage;
