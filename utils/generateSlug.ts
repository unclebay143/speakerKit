export const generateRandomSlug = (email?: string) => {
  if (email) {
    const [firstPart] = email.split('@');
    const clean = firstPart
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 6);
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `${clean}${random}`;
  }

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
};