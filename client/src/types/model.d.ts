export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string | string[];
    statusCode?: number | string;
    data?: T;
  }
  interface IUserSignUp {
    id: string;
    email: string;
    role: string;
  }
  interface IUserSignIn {
    user: {
      id: string;
      email: string;
      role: string;
    };
    access_token: string;
  }
}
