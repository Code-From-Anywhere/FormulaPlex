import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { ActionTypes } from "./Context/ActionTypes";
import { initStore, StoreState } from "./Types";

const mainReducer = (
  state: StoreState = initStore,
  action: any
): StoreState => {
  switch (action.type) {
    case ActionTypes.PURGE: {
      return initStore;
    }

    case ActionTypes.SET_CURRENT_PROJECT: {
      return { ...state, currentProjectId: action.value };
    }

    default:
      return state;
  }
};

const config = {
  key: "v3",
  storage,
  blacklist: [],
};

const rootReducer = persistReducer(config, mainReducer);

const store = createStore(rootReducer);

const persistor = persistStore(store);

export { persistor, store };
