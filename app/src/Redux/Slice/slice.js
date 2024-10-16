import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchFilterInput: [],
  multipleEditRecordId: [],
  deleteElementId: "", // This will store a single ID or be empty
  token: "",
  selectedRole: [],
  ChooseEditOrAdd: "",
  deleteStatus: "",
};

const userSlice = createSlice({
  name: "zero",
  initialState,
  reducers: {
    getFilterInputValue: (state, { payload }) => {
      // Ensure the payload is stored as an array
      state.fetchFilterInput = Array.isArray(payload) ? payload : [payload];
    },
    setMultipleEditRecoedId: (state, { payload }) => {
      const index = state.multipleEditRecordId.indexOf(payload);
      if (index > -1) {
        // If the recordId is already in the array, remove it
        state.multipleEditRecordId = state.multipleEditRecordId.filter(
          (id) => id !== payload
        );
      } else {
        // If the recordId is not in the array, add it
        state.multipleEditRecordId.push(payload);
      }
    },
    // Clear all IDs in multipleEditRecordId array
    clearAllEditRecordIds: (state) => {
      state.multipleEditRecordId = [];
    },
    getdeleteElementId: (state, { payload }) => {
      state.deleteElementId = payload;
    },
    // Clear deleteElementId
    clearDeleteElementId: (state) => {
      state.deleteElementId = "";
    },
    setToken: (state, { payload }) => {
      state.token = payload;
    },
    setSelectedRoleId: (state, { payload }) => {
      if (!Array.isArray(state.selectedRole)) {
        state.selectedRole = [];
      }

      const newSelectedRole = [...state.selectedRole];

      // Loop through the payload to either add or remove items
      payload.forEach((item) => {
        const index = newSelectedRole.findIndex(
          (t) => t.recordId === item.recordId
        );
        if (index > -1) {
          // If the recordId exists, remove it
          newSelectedRole.splice(index, 1);
        } else {
          // If the recordId doesn't exist, add it
          newSelectedRole.push(item);
        }
      });

      // Assign the updated array back to state, keeping all unique entries
      state.selectedRole = newSelectedRole;
    },
    setChooseEditOrAdd: (state, { payload }) => {
      state.ChooseEditOrAdd = payload;
    },
    triggerDeleteSuccess: (state,) => {
      state.deleteStatus = "deleted"; // Set to "deleted" when a delete action occurs
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = ""; // Reset to an empty string after the API call
    },
  },
});

export default userSlice.reducer;
export const {
  getFilterInputValue,
  setMultipleEditRecoedId,
  clearAllEditRecordIds,
  getdeleteElementId,
  clearDeleteElementId, // Export the new action
  setToken,
  setSelectedRoleId,
  setChooseEditOrAdd,
  triggerDeleteSuccess,
  resetDeleteStatus
} = userSlice.actions;
