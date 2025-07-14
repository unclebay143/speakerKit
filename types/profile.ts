export interface Profile {
  _id: string;
  userId: string;
  title: string;
  shortBio?: string;
  mediumBio?: string;
  longBio?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}