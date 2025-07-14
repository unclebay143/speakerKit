export const generateRandomSlug = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  
  for (let i = 0; i < 3; i++) {
    slug += chars.charAt(Math.floor(Math.random() * 10) + 26); 
  }
  
  for (let i = 0; i < 4; i++) {
    slug += chars.charAt(Math.floor(Math.random() * 26));
  }
  
  return slug.split('').sort(() => 0.5 - Math.random()).join('');
};