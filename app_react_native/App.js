import React from "react";
import Navigation from "./src/navigation/index";
import { PersistGate } from 'redux-persist/integration/react';
import { LogBox } from "react-native";
import { Provider } from "react-redux";
import { persistor, store } from './src/store';

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
}
