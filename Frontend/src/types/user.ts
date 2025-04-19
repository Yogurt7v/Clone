

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarUrl?: string
}

export interface IFetchedProfile {
  id?: number | undefined,
  firstName: string,
  lastName: string,
  avatarUrl?: string,
  role?: string,
  comments?: string[]
}


export interface ISignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
