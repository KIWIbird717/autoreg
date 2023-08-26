export const getastSeenMessage = (date: Date): string => {
  const now: Date = new Date(); // get the current date and time
  
  const diffMs: number = now.getTime() - date.getTime(); // calculate the time difference in milliseconds
  const diffMins: number = Math.floor(diffMs / 60000); // calculate the time difference in minutes
  const diffHours: number = Math.floor(diffMins / 60); // calculate the time difference in hours
  const diffDays: number = Math.floor(diffHours / 24); // calculate the time difference in days
  const diffWeeks: number = Math.floor(diffDays / 7); // calculate the time difference in weeks
  
  if (diffMins < 1) {
    return "last seen just now";
  } else if (diffMins < 60) {
    return `was online ${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `was online ${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return `was online ${diffDays} days ago`;
  } else {
    return `was online ${diffWeeks} weeks ago`;
  }
}