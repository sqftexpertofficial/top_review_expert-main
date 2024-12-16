import * as R from 'ramda';

export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


export function handleApiResponse(res, type = 'object', defaultErrMsg = 'Something went wrong!') {
  let details = {};
  let apiError = [];
  let successMessage = null;

  if (R.pathOr(false, ['data', 'status'], res)) {
    const defaultRes = type === 'object' ? {} : [];
    details = R.pathOr(defaultRes, ['data', 'entity'], res);
    successMessage = R.pathOr(null, ['data', 'message'], res);
  } else {
    if (typeof res?.error === 'string' || Array.isArray(res?.error)) {
      apiError = res?.error;
    } else if (typeof res?.error === 'object') {
      apiError = res?.error?.message ?? res?.errorMessage
    } else {
      apiError = res?.errorMessage;
    }

    if (!apiError) {
      apiError = defaultErrMsg;
    }

    if (typeof (apiError) === 'string') {
      apiError = [apiError];
    }
  }

  return { details, apiError, successMessage };
}

export function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getInitials(name) {
  if (!name) return '';

  // Split the name into words
  const words = name.split(' ');

  // Get the first letter of each word and join them
  const initials = words
    .filter(word => word !== '')
    .map(word => word[0].toUpperCase())
    .join('');

  return initials;
}

export function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function setCookie(name, value, days = 7, path = '/') {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path};`;
}

export const getAvatarColor = (name) => {
  const colors = [
    '#f44336', // Red
    '#2196f3', // Blue
    '#4caf50', // Green
    '#ff9800', // Orange
    '#e91e63', // Pink
    '#8bc34a', // Lime
    '#00bcd4', // Cyan
    '#673ab7', // Deep Purple
    '#ffc107', // Amber
    '#9e9e9e', // Grey
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
};

export function getRelativeTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) {
    return "created just now";
  } else if (seconds < 60) {
    return `created ${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `created ${minutes} minutes ago`;
  } else if (hours === 1) {
    return `created 1 hour ago`;
  } else if (hours < 24) {
    return `created ${hours} hours ago`;
  } else if (days < 7) {
    return `created ${days} days ago`;
  } else {
    return `created on ${date.toLocaleDateString()}`;
  }
}

export function checkTrialPeriod(date, trialDays=30) {

  // Get the current date
  const startDate= new Date(date)
  const currentDate = new Date();
  // Calculate the end date of the trial period
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + trialDays);

  // Calculate the difference in time between the current date and the end date
  const timeDifference = endDate.getTime() - currentDate.getTime();

  // If timeDifference is less than or equal to zero, the trial has ended
  if (timeDifference <= 0) {
    return false;
  }

  // Calculate remaining days
  const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

  return remainingDays;
}


const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

  return text => text.split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}
  
const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
  return encoded => encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

// // To create a cipher
// const myCipher = cipher('mySecretSalt')

// //Then cipher any text:
// console.log(myCipher('the secret string'))

// //To decipher, you need to create a decipher and use it:
// const myDecipher = decipher('mySecretSalt')
// console.log(myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f"))