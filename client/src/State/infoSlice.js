import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
    description: null,
    skills: [],
    experience: [],
    education: []
}

const infoSlice = createSlice({
    name: "info",
    initialState: initialStateValues,
    reducers: {
        setInfo: (state, action) => {
            state.description = action.payload.description;
            state.skills = action.payload.skills;
            state.experience = action.payload.experience;
            state.education = action.payload.education;
        },
        removeInfo: (state) => {
            state.description = null;
            state.skills = [];
            state.experience = [];
            state.education = [];
        }
    }
})

export const { setInfo, removeInfo } = infoSlice.actions;
export default infoSlice;