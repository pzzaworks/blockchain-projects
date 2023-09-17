import Web3 from "web3";
import { fetchData } from "../data/dataActions";
import PaintToEarn from "./PaintToEarn.json";

const network = "Avalanche";
const contract = "0x2648e6BC01AA3aE8a8194118Fa5d7FE550a0eb98";

const connectRequest = () => {
  return { type: "CONNECTION_REQUEST", };
};

const connectSuccess = (payload) => {
  return { type: "CONNECTION_SUCCESS", payload: payload, };
};

const connectFailed = (payload) => {
  return { type: "CONNECTION_FAILED", payload: payload, };
};

const updateAccountRequest = (payload) => {
  return { type: "UPDATE_ACCOUNT", payload: payload, };
};

export const connect = () => {
  return async (dispatch) => {

    dispatch(connectRequest());
    const { ethereum } = window;

    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    if (metamaskIsInstalled) {
      let web3 = new Web3(ethereum);

      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        const chainId = await ethereum.request({ method: 'eth_chainId' });

        if (chainId === '0xa86a') {
          const SmartContractObj = new web3.eth.Contract(PaintToEarn.abi, contract);

          dispatch(
          connectSuccess({
            account: accounts[0],
            smartContract: SmartContractObj,
            web3: web3,
          })
        );

        ethereum.on("accountsChanged", (accounts) => {
          dispatch(updateAccount(accounts[0]));
        });

        ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        } else {
          dispatch(connectFailed(`Change the network to ${network}.`));
        }
      } catch (err) {
        dispatch(connectFailed("There is a connection problem."));
      }
    } else {
      dispatch(connectFailed("Please install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({
      account: account
    }));
    
    dispatch(fetchData(account));
  };
};