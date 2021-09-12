import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { handleResponse } from "../actions/user.actions";
import config from "../../config";

export default class App extends React.Component {
  constructor() {
    super();
    this.
      state = {
      email: "",
      password: "",
      confirm_password: "",
      hospital_verification_code: "",
      contact: "",
    };
  }

  render() {
    const onRegisterPress = () => {
      this.setState({ loading: true });
      if (
        this.state.email == "" ||
        this.state.password == "" ||
        this.state.confirm_password == "" ||
        this.state.hospital_verification_code == ""
      ) {
        alert("All fields are required");
        this.setState({ loading: false });
        return;
      }
      if (this.state.password != this.state.confirm_password) {
        alert(
          "Password and Confirm Password fields does not match."
        );
        this.setState({ loading: false });
        return;
      }
      const requestOptions = {
        method: "Get",
        headers: { "Content-Type": "application/json" },
      };
      fetch(`${config.API}/invitation/${this.state.hospital_verification_code}`, requestOptions)
        .then(handleResponse)
        .then((invitation) => {
          Alert.alert(
            "Register hospital",
            "Hospital name is " + invitation.data.name + " and address is " + invitation.data.address + ".",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "OK", onPress: () => {
                  fetch(`${config.API}/hospital`, {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: this.state.email,
                      password: this.state.password,
                      invitation_id: invitation.data.id,
                      contact_num: this.state.contact
                    })
                  }).then(handleResponse).then(
                    () => {
                      this.setState({
                        email: "",
                        password: "",
                        contact: "",
                        confirm_password: "",
                        hospital_verification_code: "",
                        loading: false,
                      });
                      alert("Registration completed.");
                    }
                  ).catch((err) => {
                    alert(err);
                    this.setState({ loading: false });
                  })
                }
              }
            ],
            { cancelable: false }
          );
        }).catch((err) => {
          alert(err);
          this.setState({ loading: false });
          return;
        });

    };

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Roboto",
              paddingTop: 0,
              marginBottom: 30,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            Hospital Registration
          </Text>
          <Input
            keyboardType="email-address"
            style={styles.inputText}
            value={this.state.email}
            placeholder="Hospital's offical Email"
            onChangeText={(text) => this.setState({ email: text })}
            style={{ width: "80%" }}
          />
          <Input
            keyboardType="number-pad"
            style={styles.inputText}
            value={this.state.contact}
            placeholder="Hospital's offical Contact"
            onChangeText={(text) => this.setState({ contact: text })}
            style={{ width: "80%" }}
          />
          <Input
            style={styles.inputText}
            value={this.state.password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(save) => this.setState({ password: save })}
          />
          <Input
            style={styles.inputText}
            value={this.state.confirm_password}
            placeholder="Confirm password"
            secureTextEntry={true}
            onChangeText={(save) => this.setState({ confirm_password: save })}
          />
          <Input
            style={styles.inputText}
            value={this.state.hospital_verification_code}
            placeholder="Hospital Verification Code"
            onChangeText={(text) =>
              this.setState({ hospital_verification_code: text })
            }
          />
          <Button
            title="Register"
            buttonStyle={styles.registerBtn}
            titleStyle={{ flex: 1, alignSelf: "center" }}
            loading={this.state.loading}
            loadingStyle={{ flex: 1, alignSelf: "center" }}
            onPress={onRegisterPress}
          />
          <Text
            style={{
              paddingTop: 15,
              color: "blue",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
              paddingBottom: 20,
              fontSize: 15
            }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Login here
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    justifyContent: "center",
    padding: 30,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  registerBtn: {
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    height: 55,
  },
});
