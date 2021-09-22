import { AnyFile, DOC, DOCX, JPEG, JPG, MP3, MP4, OGG, PDF, PNG, PPT, PPTX, TXT, XLS, XLSX, XML } from '../svg/extensions';

export function getIconByExtension(extension?: string) {
  switch (extension?.toUpperCase()) {
    default:
      return AnyFile;
    case 'DOC':
      return DOC;
    case 'DOCX':
      return DOCX;
    case 'JPEG':
      return JPEG;
    case 'JPG':
      return JPG;
    case 'MP3':
      return MP3;
    case 'MP4':
      return MP4;
    case 'OGG':
      return OGG;
    case 'PDF':
      return PDF;
    case 'PNG':
      return PNG;
    case 'PPT':
      return PPT;
    case 'PPTX':
      return PPTX;
    case 'TXT':
      return TXT;
    case 'XLS':
      return XLS;
    case 'XLSX':
      return XLSX;
    case 'XML':
      return XML;
  }
}

export function getFileSizeLiteral(fileSize: number) {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  }
  const kilo = Math.floor(fileSize / 10.24) / 100;
  if (kilo < 1024) {
    return `${kilo} KB`;
  }
  const mega = Math.floor(kilo / 10.24) / 100;
  if (mega < 1024) {
    return `${mega} MB`;
  }
  const giga = Math.floor(mega / 10.24) / 100;
  return `${giga} GB`;
}

export default getIconByExtension;
