import React from "react";
import { Header, Input } from "react-native-elements";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Button } from "react-native";
import { handleResponse } from "../actions/user.actions";
import { useSelector } from "../store";
import config from "../../config";

function ChangePasswordScreen({ navigation }) {
  const [current_password, setcurrent_password] = React.useState("");
  const [new_password, setnew_password] = React.useState("");
  const [confirm_password, setconfirm_password] = React.useState("");
  const user = useSelector(state => state.authentication.user)
  const changePassword = (current_password, new_password) => {
    if (new_password != confirm_password) {
      alert(
        "Please Enter same password in Password and Confirm Password fields."
      );
      return;
    }
    fetch(`${config.API}/hospital/changePassword`, {
      method: "Post",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({
        newPassword: new_password,
        oldPassword: current_password
      })
    }).then(handleResponse).then(
      () => {
        setconfirm_password("");
        setcurrent_password("");
        setnew_password("");
        alert("Password changed.");
      }
    ).catch((err) => {
      alert(err);
      this.setState({ loading: false });
    });
  };
  return (
    <>
      <Header
        leftComponent={{
          icon: "menu",
          color: "#fff",
          size: 30,
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{
          text: "Change Password",
          style: { color: "#fff", fontSize: 20 },
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.headertext}>
            Please enter your current password and new password to change it.
          </Text>
          <Input
            placeholder="Current Password"
            secureTextEntry={true}
            value={current_password}
            onChangeText={(text) => setcurrent_password(text)}
          />
          <Input
            placeholder="New Password"
            secureTextEntry={true}
            value={new_password}
            onChangeText={(text) => setnew_password(text)}
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirm_password}
            onChangeText={(text) => setconfirm_password(text)}
          />
          <Button
            title="Change Your Password"
            onPress={() => changePassword(current_password, new_password)}
          />
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: 20,
    paddingStart: 40,
    paddingEnd: 40,
  },
  headertext: {
    fontWeight: "bold",
    paddingTop: 20,
    paddingStart: 20,
    paddingEnd: 20,
    paddingBottom: 40,
    fontSize: 17,
  },
});

export default ChangePasswordScreen;
