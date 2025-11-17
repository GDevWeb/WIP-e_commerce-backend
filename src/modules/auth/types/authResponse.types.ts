export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}
