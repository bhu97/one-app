import { makeStyles } from '@material-ui/core';
import React, { FC, useRef, useState } from 'react';
import SimpleModal from 'renderer/components/atoms/SimpleModal';
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
import { toast } from 'material-react-toastify';
// import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  rightColumn: {
    flexBasis: '300px',
  },
  divider: {
    marginBottom: theme.spacing(3),
    maxHeight: 0,
  },
  root: {
    width: 'auto',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export const CartPage: FC = () => {
  const [open, setOpen] = React.useState(false);
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  // TODO: this is only temporary for testing mail
  // set your email for testing the mail part
  // const [email, setEmail] = useState(['bhumika.r@capgemini.com']);
  // const emailSubjectRef = useRef('One Desktop App Test Mail');
  // const emailTextRef = useRef('Test Mail with attachments');
  // ---
  const [loadingMessage, setLoadingMessage] = useState('');
  const { items, thumbnails, updateItems } = useGetFilesData(cartStore);
  const { trackSendFiles } = useTracking();
  var country: string | undefined;
  if (items.length > 0) {
    country = items[0].country;
  }
  const handleOpen = () => {
    if (items.length > 0) {
      setOpen(true);
    } else {
      toast.error(
        'There are no attachments to send! Add an attachment to the shopping cart and try again!'
      );
    }
  };
  const attachmentSize = () => {
    if (cartStore.fileSizes >= cartStore.fileSizeLimit) {
      toast.error('Attachment size is more than 20MB');
      setOpen(false);
    }
    //  else {
    //   setOpen(true);
    // }
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log('cartSTore', cartStore.items);
  console.log('filesizesssslimi', cartStore.fileSizeLimit);
  console.log('filesizessss', cartStore.fileSizes);

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
                text="Send via e-mail"
                icon={EmailIcon}
                onClick={async () => {
                  setIsLoading(true);
                  setLoadingMessage('Downloading & sending files');
                  // await dataManager.sendCartMail(
                  //   email,
                  //   emailSubjectRef.current,
                  //   emailTextRef.current
                  // );
                  trackSendFiles(
                    items.map((item) => item.name ?? ''),
                    country
                  );
                  setIsLoading(false);
                  handleOpen();
                  attachmentSize();
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
      <SimpleModal
        items={cartStore.items}
        open={open}
        setOpen={handleOpen}
        setClose={handleClose}
      />
    </>
  );
};

export default CartPage;
