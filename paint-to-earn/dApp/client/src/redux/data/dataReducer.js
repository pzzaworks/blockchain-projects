const initialState = {
  loading: false,
  error: false,
  //cost: 0,
  notification: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        notification: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        // cost: action.payload.cost,
        notification: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        notification: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
