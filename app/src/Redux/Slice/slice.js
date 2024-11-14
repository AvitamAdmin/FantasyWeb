import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchFilterInput: [],
  multipleEditRecordId: [],
  deleteElementId: "", // This will store a single ID or be empty
  token: "",
  selectedRole: [],
  ChooseEditOrAdd: "",
  deleteStatus: "",
  cronExpression:"",
  toolkitRoutePath:""
};

const userSlice = createSlice({
  name: "zero",
  initialState,
  reducers: {
    getFilterInputValue: (state, { payload }) => {
      state.fetchFilterInput = Array.isArray(payload) ? payload : [payload];
    },
    setMultipleEditRecoedId: (state, { payload }) => {
      if (Array.isArray(payload)) {
        // If the payload is an array (e.g., Select All), replace the entire state
        state.multipleEditRecordId = payload;
      } else {
        // Handle individual record selection
        const index = state.multipleEditRecordId.indexOf(payload);
        if (index > -1) {
          // Remove if already selected
          state.multipleEditRecordId = state.multipleEditRecordId.filter(
            (id) => id !== payload
          );
        } else {
          // Add if not selected
          state.multipleEditRecordId.push(payload);
        }
      }
    },

    clearAllEditRecordIds: (state) => {
      state.multipleEditRecordId = [];
    },

    getdeleteElementId: (state, { payload }) => {
      state.deleteElementId = payload;
    },
    clearDeleteElementId: (state) => {
      state.deleteElementId = "";
    },

    setToken: (state, { payload }) => {
      state.token = payload;
    },

    setSelectedRoleId: (state, { payload }) => {
      const newSelectedRole = [...state.selectedRole];
      payload.forEach((item) => {
        const index = newSelectedRole.findIndex(
          (t) => t.recordId === item.recordId
        );
        if (index > -1) {
          newSelectedRole.splice(index, 1);
        } else {
          newSelectedRole.push(item);
        }
      });
      state.selectedRole = newSelectedRole;
    },

    setChooseEditOrAdd: (state, { payload }) => {
      state.ChooseEditOrAdd = payload;
    },

    triggerDeleteSuccess: (state) => {
      state.deleteStatus = "deleted";
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "";
    },
    deleteCronExpression: (state) => {
      state.cronExpression = "";
    },
    getCronExpression: (state, { payload }) => {
      state.cronExpression = payload;
    },
    setToolkitRoutePath: (state, { payload }) => {
      state.toolkitRoutePath = payload;
    },
  },
});

export default userSlice.reducer;
export const {
  getFilterInputValue,
  setMultipleEditRecoedId,
  clearAllEditRecordIds,
  getdeleteElementId,
  clearDeleteElementId,
  setToken,
  setSelectedRoleId,
  setChooseEditOrAdd,
  triggerDeleteSuccess,
  resetDeleteStatus,
  getCronExpression,
  deleteCronExpression,
  setToolkitRoutePath
} = userSlice.actions;