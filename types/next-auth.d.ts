import "next-auth";

declare module "next-auth" {
   interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    image?: string;
    isPublic?: boolean;
    website?: string;
    location?: string;
    socialMedia?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      email?: string;
    };
  }

  interface Session {
      user: {
      id: string;
      name: string;
      email: string;
      username?: string;
      image?: string;
      location?: string;
      website?: string;
      isPublic?: boolean;
      socialMedia?: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        email?: string;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    username?: string;
    image?: string;
    isPublic?: boolean;
    location?: string;
    website?: string;
    socialMedia?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      email?: string;
    };
  }
}