export const getTimeago =(timeCreated:any) => {
  
  const date:any = new Date(timeCreated);
  const now:any = new Date();
  const seconds= Math.floor((now - date) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor((seconds % 31536000) / 2592000);
  const days = Math.floor((seconds % 2592000) / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (years >= 1) {
    // if (months >= 1) {
    //   return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} ago`;
    // } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    // }
  }

  if (months >= 1) {
    // if (days >= 1) {
    //   return `${months} month${months > 1 ? 's' : ''}, ${days} day${days > 1 ? 's' : ''} ago`;
    // } else {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    // }
  }

  if (days >= 1) {
    // if (hours >= 1) {
    //   return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''} ago`;
    // } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    // }
  }

  if (hours >= 1) {
    // if (minutes >= 1) {
    //   return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    // } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    // }
  }

  if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  return "Just now";
}

export const dataURLToBlob = (dataURL: string): Blob => {
  const [header, data] = dataURL.split(',');
  const mimeString = header.split(':')[1].split(';')[0];
  const byteString = atob(data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
};

export const getFileType = (fileName:any) => {

  if (!fileName || typeof fileName !== 'string') {
      return "Invalid file name";
  }

  const parts = fileName.split('.');
  const fileExtension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';

  const fileTypes: { [key: string]: { extensions: string[]; icon: string } } = {
      image: { extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'], icon: 'image' },
      pdf: { extensions: ['pdf'], icon: "fa-regular:file-pdf" },
      document: { extensions: ['doc', 'docx', 'txt', 'odt', 'rtf'], icon: "mi:document" },
      spreadsheet: { extensions: ['xls', 'xlsx', 'csv', 'ods'], icon: "uiw:file-excel" },
      presentation: { extensions: ['ppt', 'pptx', 'odp'], icon: "teenyicons:ppt-outline" },
      video: { extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'], icon: '' },
      audio: { extensions: ['mp3', 'wav', 'aac', 'flac', 'ogg'], icon: '' },
      archive: { extensions: ['zip', 'rar', '7z', 'tar', 'gz'], icon: '' },
      code: { extensions: ['html', 'css', 'js', 'ts', 'json', 'xml', 'py', 'java', 'cpp', 'c'], icon: '' },
  };

  for (const { extensions, icon } of Object.values(fileTypes)) {
      if (extensions.includes(fileExtension as string)) {
          return icon;
      }
  }

  return '"f7:doc-fill" ';
}

export const handleDownloadFile = async (fileUrl:any, key:any) => {
  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error('Failed to fetch the file');
  const blob = await response.blob();

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = key; 

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the Blob URL to free memory
  URL.revokeObjectURL(link.href);
}


