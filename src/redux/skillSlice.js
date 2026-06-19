import {
 createSlice
}
from "@reduxjs/toolkit";

const skillSlice =
createSlice({

 name:"skills",

 initialState:{
  skills:[]
 },

 reducers:{

  setSkills:(
   state,
   action
  )=>{

   state.skills =
    action.payload;

  }

 }

});

export const {
 setSkills
}
=
skillSlice.actions;

export default
skillSlice.reducer;