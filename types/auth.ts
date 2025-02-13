export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  firstName: string;
  lastName: string;
}