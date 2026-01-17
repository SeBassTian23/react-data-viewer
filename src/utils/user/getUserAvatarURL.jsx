import md5 from '../../helpers/md5';

export const getUserAvatarURL = (email, size=null) => {
  if (!email || !email.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm)) return null;

  const emailHash = md5(email);

  return `https://www.gravatar.com/avatar/${emailHash}?d=initials${size? '&s='+String(size) : ''}`;
};