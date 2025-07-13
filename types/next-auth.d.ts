import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    image?: string;
    isPublic?: boolean;
    theme?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username?: string;
      image?: string;
      isPublic?: boolean;
      theme?: string;
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
    theme?: string;
  }
}
