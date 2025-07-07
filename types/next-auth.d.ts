import "next-auth";

declare module "next-auth" {
   interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    image?: string;
    isPublic?: boolean;
  }

  interface Session {
        user: {
        id: string;
        name: string;
        email: string;
        username?: string;
        image?: string;
        isPublic?: boolean;
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
  }
}