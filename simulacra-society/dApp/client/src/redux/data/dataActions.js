import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store.getState().blockchain.smartContract.methods.totalSupply().call();
      let maxSupply = await store.getState().blockchain.smartContract.methods.maxSupply().call();
      let mintPrice = await store.getState().blockchain.smartContract.methods.mintPrice().call();
      
      dispatch(
        fetchDataSuccess({
          totalSupply,
          maxSupply,
          mintPrice,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
