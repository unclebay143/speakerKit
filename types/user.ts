export interface UserData {
  name: string;
  email: string;
  image: string;
  location: string;
  createdAt: string;
  theme: string;
  tools?: string[];
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    email?: string;
    website?: string;
  };
  expertise?: string[];
  topics?: string[];
}
