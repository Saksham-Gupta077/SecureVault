export function generatePassword(username: string): string {
  if (!username) return '';
  const specialChars = '@#&$';
  const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomNumber = Math.floor(Math.random() * 900) + 100; // 100-999
  return `${username}${randomSpecial}${randomNumber}`;
}
