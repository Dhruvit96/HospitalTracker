import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import SearchScreen from "../screens/SearchScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import AddBeds from "../screens/AddBeds";
import DoctorScreen from "../screens/DoctorScreen";
import FAQ from "../screens/FAQ";
import { useDispatch } from "react-redux";
import { userActions } from "../actions";
import { useSelector } from "../store";

const Stack = createStackNavigator();

const UserStack = () => {
  const navigationOptions = {
    gestureEnabled: false,
  };
  return (
    <Stack.Navigator screenOptions={navigationOptions}>
      <Stack.Screen
        component={HomeScreen}
        name="Home"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={RegisterScreen} name="Register" />
      <Stack.Screen component={LoginScreen} name="Login" />
      <Stack.Screen component={SearchScreen} name="Search" />
      <Stack.Screen component={FAQ} name="FAQs" />
    </Stack.Navigator>
  );
};

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <Text style={{ padding: 20, fontSize: 15, fontWeight: "bold" }}>
        Welcome
      </Text>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => dispatch(userActions.logout())}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Add Beds" component={AddBeds} />
      <Drawer.Screen name="Doctors data" component={DoctorScreen} />
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen} />
    </Drawer.Navigator>
  );
}

const index = () => {
  const loggedIn = useSelector((state) => state.authentication.loggedIn);
  return (
    <NavigationContainer>
      {!loggedIn ? <UserStack /> : <MyDrawer />}
    </NavigationContainer>
  );
};

export default index;
