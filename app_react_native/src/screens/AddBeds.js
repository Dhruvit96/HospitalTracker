import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Header, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import { handleResponse } from "../actions/user.actions";
import config from "../../config";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      recovery_rate: "",
      total_available_beds: "",
      total_beds: "",
      total_special_ward: "",
      available_special_wards: "",
      available_general_wards: "",
      isLoading: false,
      isDataAdded: false,
    };
  }

  inputValueUpdate = (text, prop) => {
    const state = this.state;
    state[prop] = parseInt(text, 10);
    this.setState(state);
  };

  getData = () => {
    fetch(`${config.API}/data/${this.props.user.id}`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse).then(
      (res) => {
        if (res.data.isDataAdded) {
          this.setState({
            recovery_rate: res.data.recovery_rate.toString(),
            total_available_beds: res.data.total_available_beds.toString(),
            total_beds: res.data.total_beds.toString(),
            total_special_ward: res.data.total_special_ward.toString(),
            available_special_wards: res.data.available_special_wards.toString(),
            available_general_wards: res.data.available_general_wards.toString(),
            isDataAdded: true,
          });
        }
      }
    ).catch((err) => {
      alert(err);
    })
  };

  componentDidMount() {
    this.getData();
  }

  storeUser() {
    if (
      this.state.recovery_rate == "" ||
      this.state.total_available_beds == "" ||
      this.state.total_beds == "" ||
      this.state.total_special_ward == "" ||
      this.state.available_special_wards == "" ||
      this.state.available_general_wards == ""
    ) {
      alert("All fields are required");
      this.setState({ loading: false });
      return;
    } else {
      this.setState({
        isLoading: true,
      });
      fetch(`${config.API}/data`, {
        method: "Put",
        headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + this.props.user.token },
        body: JSON.stringify({
          recovery_rate: this.state.recovery_rate,
          total_available_beds: this.state.total_available_beds,
          total_beds: this.state.total_beds,
          total_special_ward: this.state.total_special_ward,
          available_special_wards: this.state.available_special_wards,
          available_general_wards: this.state.available_general_wards
        })
      }).then(handleResponse).then(() => {
        !this.state.isDataAdded ? alert("Data Added") : alert("Data updated");
        this.setState({
          isLoading: false,
          isDataAdded: true,
        });
      }).catch((err) => {
        console.error(err);
        alert("Something went wrong try again later.");
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  render() {
    return (
      <>
        <Header
          leftComponent={{
            icon: "menu",
            color: "#fff",
            size: 30,
            onPress: () => this.props.navigation.openDrawer(),
          }}
          centerComponent={{
            text: "Bed Avaibility Details",
            style: { color: "#fff", fontSize: 20 },
          }}
        />
        <View style={styles.container}>
          <ScrollView>
            <Input
              keyboardType="decimal-pad"
              value={this.state.recovery_rate}
              label="Recovery Rate"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "recovery_rate")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.total_beds}
              label="Total Beds"
              onChangeText={(text) => this.inputValueUpdate(text, "total_beds")}
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.total_available_beds}
              label="Total Available Beds"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "total_available_beds")
              }
            />

            <Input
              keyboardType="decimal-pad"
              value={this.state.total_special_ward}
              label="Total Special Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "total_special_ward")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.available_special_wards}
              label="Available Special Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "available_special_wards")
              }
            />
            <Input
              keyboardType="decimal-pad"
              value={this.state.available_general_wards}
              label="Available General Wards"
              onChangeText={(text) =>
                this.inputValueUpdate(text, "available_general_wards")
              }
            />
            <Button
              title={this.state.isDataAdded ? "Update" : "Add"}
              loading={this.state.isLoading}
              onPress={() => this.storeUser()}
            />
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f3",
    paddingTop: 20,
    paddingStart: 20,
    paddingEnd: 20,
  },
});

function mapState(state) {
  const { user } = state.authentication;
  return { user };
}


export default connect(mapState)(App);