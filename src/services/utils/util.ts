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

