import md5 from '../../helpers/md5';

/**
 * Function to construct url for avatar image from gravatar
 * @param {String} email email address
 * @param {Number} size size in pixel (default: null for default size)
 * @returns url for gravatar avatar image
 */
export const getUserAvatarURL = (email, size=null) => {
  if (!email || !email.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm)) return null;

  const emailHash = md5(email);

  return `https://www.gravatar.com/avatar/${emailHash}?d=initials${size? '&s='+String(size) : ''}`;
};