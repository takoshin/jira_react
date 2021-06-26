// authSlice.ts
// Types of profile data from the API
export interface LOGIN_USER {
  id: number;
  username: string;
}
//Types of avatar pictures from the API
export interface FILE {
  readonly lastModified: number;
  readonly name:string;
}
export interface PROFILE {
  id: number;
  user_profile: number;
  img: string | null;
}
export interface POST_PROFILE {
  id: number;
  img: File | null;
}
export interface CRED {
  username: string;
  password: string;
}
export interface JWT {
  refresh: string;
  access: string;
}
export interface USER {
  id: number;
  username: string;
}
export interface AUTH_STATE {
  isLoginView: boolean;
  loginUser: LOGIN_USER;
  profiles: PROFILE[];
}
