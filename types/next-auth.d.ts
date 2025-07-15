import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    slug?: string;
    // username?: string;
    image?: string;
    isPublic?: boolean;
    theme?: string;
    location?: string;
    website?: string;
    plan?: "free" | "pro" | "lifetime"; 
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
      slug?: string
      // username?: string;
      image?: string;
      isPublic?: boolean;
      theme?: string;
      location?: string;
      website?: string;
      plan?: "free" | "pro" | "lifetime"; 
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
    slug: string;
    // username?: string;
    image?: string;
    isPublic?: boolean;
    theme?: string;
    location?: string;
    website?: string;
    plan?: "free" | "pro" | "lifetime"; 
    socialMedia?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      email?: string;
    };
  }
}
