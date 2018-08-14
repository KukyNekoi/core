export interface User {
  id: string;
  first_name: string;
  username: string;
  email: string;
  last_name: string;
  profile_picture: string;
  role_ids: string[];
  writes: string[];
  reads: string[];
}
