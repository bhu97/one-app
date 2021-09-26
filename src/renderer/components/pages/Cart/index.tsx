import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';

import headerImage from '../../../../../assets/cart/200921_FMC_OneApp_Illustrationen_Final_Documents.png';
import { cartStore } from '../../../database/stores/CartStore';
import { FileCommands } from '../../../enums';
import { getFileSizeLiteral, useGetFilesData } from '../../../helpers';
import { DatabaseIcon, DocsIcon, EmailIcon, TrashIcon } from '../../../svg';
import { RightMenuBox, RightMenuItem } from '../../atoms';
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
  const { items, thumbnails } = useGetFilesData(cartStore);

  return (
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
          thumbnails={thumbnails}
          title="All added documents"
        />
      }
      column={
        <div className={styles.rightColumn}>
          <RightMenuBox title="Options">
            <RightMenuItem
              key="send"
              text="Send via e-mail"
              icon={EmailIcon}
              onClick={console.log}
            />
            <RightMenuItem
              key="remove"
              text="Remove all Files"
              icon={TrashIcon}
              onClick={cartStore.removeAll}
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
  );
};

export default CartPage;
