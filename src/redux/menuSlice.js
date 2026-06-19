import {
 createSlice
}
from "@reduxjs/toolkit";

const menuSlice =
createSlice({

 name:"menu",

 initialState:{
  menus:[]
 },

 reducers:{

  setMenus:(
   state,
   action
  )=>{

   state.menus =
    action.payload;

  }

 }

});

export const {
 setMenus
} = menuSlice.actions;

export default
menuSlice.reducer;