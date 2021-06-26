import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import axios from 'axios'
import {
  AUTH_STATE,
  CRED,
  LOGIN_USER,
  POST_PROFILE,
  PROFILE,
  JWT,
  USER,
} from '../types'
import { AccessTimeOutlined } from '@material-ui/icons';


//Feach JWT Token
export const fetchAsyncLogin = createAsyncThunk(
  'auth/login',
  async (auth: CRED) => {
    const res = await axios.post<JWT>(
      `${process.env.REACT_APP_API_URL}/authen/jwt/create/`,
      auth, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  }
);


//Register New Account
export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (auth: CRED) => {
    const res = await axios.post<USER>(
      `${process.env.REACT_APP_API_URL}/api/create/`,
      auth,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  }
);


// Login User
export const fetchAsyncGetMyProf = createAsyncThunk(
  'auth/loginuser',
  async () => {
    const res = await axios.post<LOGIN_USER>(
      `${process.env.REACT_APP_API_URL}/api/loginuser/`,
      {
        headers: {
          Authorization: `localStorage.localJWT`,
        },
      }
    )
    return res.data;
  }
);


// Create Profile
export const fetchAsyncCreateProf = createAsyncThunk(
  'auth/createProfile',
  async () => {
    const res = await axios.post<PROFILE>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      {img: null},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'localStoorage.localJWT',
        },
      }
    )
    return res.data;
  }
);


//Get Profiles
export const fetchAsyncGetProfs = createAsyncThunk (
  'auth/getProfiles',
  async () => {
    const res = await axios.get<PROFILE[]>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      {
        headers: {
          Authorizatioin: `JWT ${localStorage.localJWT}`
        },
      }
    )
    return res.data;
  }
);


//Update Profile
export const fetchAsyncUpdateProf = createAsyncThunk (
  'auth/updateProfile',
  async (profile:POST_PROFILE) => {
    const uploadData = new FormData();
    profile.img && uploadData.append('img', profile.img, profile.img.name);
    const res =await axios.put<PROFILE>(
      `${process.env.REACT_APP_API_URL}/api/profile/${profile.id}`,
      uploadData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorizetion: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data
  }
);


const initialState: AUTH_STATE = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: ''
  },
  profiles: [{
    id: 0,
    user_profile: 0,
    img: null
  }]
};

//AuthSlice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Toggle Login Logout
  reducers: {
    toggleMode(state) {
      state.isLoginView = !state.isLoginView;
    },
  },
  //Store the obtained JWT tokens in local storage. 
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncLogin.fulfilled,
      (state, action: PayloadAction<JWT>) => {
        localStorage.setItem('localJWT', action.payload.access);
        action.payload.access && (window.location.href = '/tasks');
      }
    );
    //Stores the profile received upon successful login.
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      (state, action: PayloadAction<LOGIN_USER>) => {
        return {
          ...state,
          loginUser: action.payload,
        };
      }
    );
    //Store the list of profiles you have obtained.
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      (state, action: PayloadAction<PROFILE[]>) => {
        return {
          ...state,
          profiles: action.payload,
        };
      }
    );
    //Reflect the changed status.
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      (state, action: PayloadAction<PROFILE>) => {
        return {
          ...state,
          profiles: state.profiles.map((prof) => 
          prof.id === action.payload.id ? action.payload : prof
          ),
        };
      }
    );
  },
});

export const { toggleMode } = authSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectIsLoginUser = (state: RootState) => state.auth.loginUser;
export const selectIsProfile = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
