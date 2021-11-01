import React, { FC } from 'react';
import { BackButton } from 'renderer/components/atoms';
import { dataManager } from 'renderer/DataManager';

interface FileViewerProps {
  url: string
}
 
export const FileViewer: FC<FileViewerProps> = ({url = "https://fresenius.sharepoint.com/teams/FMETS0269990/Shared%20Documents/master/000%20Company%20Presentation/FME_IPDF_MT-EN_03_21.pdf"}) => {
  //window.location.href = url
  window.electron.ipcRenderer.openHTML(url, false)
  return (
    <div>
      <BackButton onClick={()=>{}}></BackButton>
     {/* <webview src="https://github.com" nodeintegration webpreferences="allowRunningInsecureContent, javascript=no"></webview> */}
 
      {/* <webview src={url} style={{"display":"inline-flex", "width":"640px", "height":"480px"}}>
       
      </webview> */}
    </div>
  );
}
 