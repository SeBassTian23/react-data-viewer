import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  allowCookies: localStorage.getItem('APP_USER_COOKIES')? true : false,
  avatar: localStorage.getItem('APP_USER_AVATAR') === 'null'? null : localStorage.getItem('APP_USER_AVATAR'),
  colorScheme: localStorage.getItem('APP_USER_COLOR_PALETTE') || 'default',
  darkmode: localStorage.getItem('APP_USER_DARKMODE') !== 'system'? JSON.parse(localStorage.getItem('APP_USER_DARKMODE')) : 'system',
  email: localStorage.getItem('APP_USER_EMAIL'),
  enableGravatar: localStorage.getItem('APP_USER_GRAVATAR') === 'true'? true : false,
  name: localStorage.getItem('APP_USER_NAME'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile(state, action) {
      return {...state, ...action.payload}
    },
    resetProfile(state, action){
      return initialState;
    }
  }
})

export const { updateProfile, resetProfile } = userSlice.actions
export default userSlice.reducer
