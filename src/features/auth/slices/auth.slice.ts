import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../../utlis/store';
import {useSelector} from 'react-redux';

type SignInPayload = Pick<UserState, 'email' | 'name' | 'role' | 'userId'>;

export interface UserState {
  isLoggedIn: boolean;
  role: string;
  email: string;
  name: string;
  userId: number;
}

const initialState: UserState = {
  isLoggedIn: false,
  email: '',
  name: '',
  role: '',
  userId: 0,
};

export const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setSignIn: (state, action: PayloadAction<SignInPayload>) => {
      state.email = action.payload.email;
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
    setSignOut: state => {
      state.email = '';
      state.name = '';
      state.role = '';
      state.userId = 0;
      state.isLoggedIn = false;
    },
  },
});

export const {setSignIn, setSignOut} = authSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.userAuth.isLoggedIn;
export const selectEmail = (state: RootState) => state.userAuth.email;
export const selectName = (state: RootState) => state.userAuth.name;
export const selectRole = (state: RootState) => state.userAuth.role;
export const selectUserId = (state: RootState) => state.userAuth.userId;

export const useUserAuth = () => {
  return useSelector((state: RootState) => state.userAuth);
};

export default authSlice.reducer;
