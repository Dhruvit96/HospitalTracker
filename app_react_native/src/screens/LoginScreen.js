import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { userActions } from "../actions";
import { connect } from "react-redux";

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text
            style={{
              fontSize: 35,
              fontFamily: "Roboto",
              marginBottom: 30,
              fontWeight: "bold",
              marginTop: 50,
              alignSelf: "center",
            }}
          >
            Hospital Login
          </Text>
          <View>
            <Input
              style={styles.inputText}
              placeholder="Email"
              onChangeText={(text) => this.setState({ email: text })}
            />
          </View>
          <View>
            <Input
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          <Button
            title="Login"
            buttonStyle={styles.loginBtn}
            titleStyle={{ flex: 1, alignSelf: "center" }}
            loadingStyle={{ flex: 1, alignSelf: "center" }}
            loading={this.props.loading}
            onPress={() => this.props.login(this.state.email, this.state.password)}
          />
          <Text
            style={{
              paddingTop: 15,
              color: "blue",
              alignSelf: "center",
              paddingBottom: 20,
            }}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            Please register your hospital here
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
    paddingStart: 30,
    paddingEnd: 30,
  },
  loginBox: {
    width: 320,
    height: 520,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  loginText: {
    color: "white",
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    height: 55,
  },
});


function mapState(state) {
  const { loading } = state.authentication;
  return { loading };
}

const actionCreators = {
  login: userActions.login,
  logout: userActions.logout,
};

export default connect(mapState, actionCreators)(LoginScreen);
