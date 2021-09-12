import { createStore, applyMiddleware } from "redux";
import { useSelector as useReduxSelector } from "react-redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['authentication'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunkMiddleware));

export const useSelector = useReduxSelector;

export const persistor = persistStore(store);
