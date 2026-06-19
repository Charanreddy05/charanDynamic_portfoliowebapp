import {
 configureStore
} from "@reduxjs/toolkit";

import authReducer
from "../redux/authSlice";

import themeReducer
from "../redux/themeSlice";

import menuReducer
from "../redux/menuSlice";

import skillReducer
from "../redux/skillSlice";

import projectReducer
from "../redux/projectSlice";

import profileReducer
from "../redux/profileSlice";

export const store =
configureStore({
 reducer:{
  auth: authReducer,
  theme: themeReducer,
  menu: menuReducer,
  skills: skillReducer,
  projects: projectReducer,
  profile: profileReducer,
 }
});