export interface UserData {
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  contact_no: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  is_approve?: boolean;
  last_login?: Date;
  date_joined?: Date;
  created_at?: Date;
  updated_at?: Date;
}
