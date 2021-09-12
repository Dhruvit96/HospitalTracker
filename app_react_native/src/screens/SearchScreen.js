import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, SearchBar, Overlay } from "react-native-elements";
import { Card } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { handleResponse } from "../actions/user.actions";
import config from "../../config";

const ShowDetail = ({ item }) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [data, setData] = useState({ total_beds: 0 });
  useEffect(() => {
    fetch(`${config.API}/data/${item.id}`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse).then(
      (res) => {
        if (res.data.isDataAdded) {
          setData({
            recovery_rate: res.data.recovery_rate.toString(),
            total_available_beds: res.data.total_available_beds.toString(),
            total_beds: res.data.total_beds.toString(),
            total_special_ward: res.data.total_special_ward.toString(),
            available_special_wards: res.data.available_special_wards.toString(),
            available_general_wards: res.data.available_general_wards.toString(),
          });
        }
      }
    ).catch((err) => {
      alert(err);
    })
  }, [])
  return (
    <Card>
      <Text style={{ fontWeight: "bold", fontSize: 17 }}>{item.name}</Text>
      <Text>
        {item.total_beds != 0 ? (
          <>Total Available Beds: {item.total_available_beds} </>
        ) : (
          <Text style={{ color: "red" }}>
            This Hospital has not added data yet.{" "}
          </Text>
        )}
      </Text>
      <TouchableOpacity onPress={() => setIsShowDetail(!isShowDetail)}>
        <Text style={{ color: "blue" }}>Show details</Text>
        <Overlay
          isVisible={isShowDetail}
          onBackdropPress={() => setIsShowDetail(!isShowDetail)}
          backdropStyle={{ backgroundColor: "" }}
          overlayStyle={{ height: "80%", width: "80%" }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            {item.name}
            {"\n"}
          </Text>
          <Text>
            {"Full Address: " + item.address}
            {"\n"}
            {"\n"}
            {"City: " + item.city}
            {"\n"}
            {"\n"}
            {"Contact Number: " + item.contact_num}
            {"\n"}
          </Text>
          {data.total_beds != 0 ? (
            <>
              <Text>

                {"Recovery Rate: " + data.recovery_rate + "%"}
                {"\n"}
                {"\n"}
                {"Total Bed Capacity: " + data.total_beds}
                {"\n"}
                {"\n"}
                {"Total Available Beds: " + data.total_available_beds}
                {"\n"}
                {"\n"}
                {"Total Special Wards: " + data.total_special_ward}
                {"\n"}
                {"\n"}
                {"Available Special Ward: " + data.available_special_wards}
                {"\n"}
                {"\n"}
                {"Available General Ward: " + data.available_general_wards}
              </Text>
            </>
          ) : (
            <Text style={{ alignSelf: "center", fontSize: 18, paddingTop: 30, color: 'red' }}>
              Other Data is not Added by the Hospital yet.
            </Text>
          )}
        </Overlay>
      </TouchableOpacity>
    </Card>
  );
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      modalVisible: true,
      filterVisible: false,
      ShowDetailsFiletervisible: false,
      cities: [],
      city: "City",
      users: [],
      enable: false,
      pageNumber: 2,
      endReached: false,
    };
    this.fetchUsers();
    this.getCities();
  }

  fetchUsers = () => {
    let params = this.state.search.length > 0 ? "name=" + this.state.search : "";
    params = this.state.enable ? "city=" + this.state.city : "";
    fetch(`${config.API}/hospital?${params}`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse).then(
      (res) => {
        this.setState({ users: res.data.hospitals })
      }
    ).catch((err) => {
      alert(err);
    });
  };

  fetchMoreUsers = () => {
    let params = this.state.search.length > 0 ? "name=" + this.state.search : "";
    params = this.state.enable ? "city=" + this.state.city : "";
    params = "pageNumber=" + this.state.pageNumber;
    fetch(`${config.API}/hospital?${params}`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse).then(
      (res) => {
        let update = { users: [...this.state.users, ...res.data.hospitals], pageNumber: this.state.pageNumber + 1 };
        if (res.data.totalHospitals < 10)
          update.endReached = true;
        this.setState(update);
      }
    ).catch((err) => {
      alert(err);
    });
  };

  getCities = () => {
    fetch(`${config.API}/city`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    }).then(handleResponse).then(
      (res) => {
        this.setState({ cities: res.data })
        this.setState({ city: res.data[0] });
      }
    ).catch((err) => {
      console.error(err);
    });
  };

  toggleOverlay = () => {
    this.setState({ ...this.state, filterVisible: !this.state.filterVisible });
  };

  render() {
    const { search } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 0 }}>
          <SearchBar
            placeholder="Search Hospitals..."
            value={search}
            onChangeText={(text) => {
              this.setState({ search: text }, () => {
                this.fetchUsers();
              });
            }}
            lightTheme
          />
        </View>
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <FlatList
              numColumns={1}
              horizontal={false}
              data={this.state.users}
              ListEmptyComponent={() => (
                <View style={{ flex: 1, alignSelf: "center", paddingTop: 15 }}>
                  <Text style={{ fontSize: 18 }}>No Results Found</Text>
                </View>
              )}
              onEndReached={() => !this.state.endReached && this.fetchMoreUsers()}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ShowDetail item={item} />}
            />
          </View>
        </SafeAreaView>
        <View>
          <Button title="Filter" onPress={this.toggleOverlay} />
          <Overlay
            isVisible={this.state.filterVisible}
            onBackdropPress={this.toggleOverlay}
            overlayStyle={{ height: "40%", width: "70%" }}
          >
            <Text
              style={styles.overlayText}
            >
              Select City:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 4,
                marginTop: 10,
                marginBottom: 50,
              }}
            >
              <Picker
                selectedValue={this.state.city}
                style={{ height: 50, width: 250 }}
                mode={"dialog"}
                onValueChange={(itemValue) =>
                  this.setState({ city: itemValue })
                }
              >
                {this.state.cities.map((item) => (
                  <Picker.Item label={item} key={item} value={item} />
                ))}
              </Picker>
            </View>
            <Button
              title="Apply"
              buttonStyle={styles.btnstyle}
              onPress={() => {
                this.setState({ enable: true }, () => {
                  this.fetchUsers();
                  this.toggleOverlay();
                });
              }}
            />
            <Button
              title="Clear"
              buttonStyle={styles.btnstyle}
              onPress={() => {
                this.setState({ enable: false }, () => {
                  this.fetchUsers(this.state.search);
                  this.toggleOverlay();
                });
              }}
            />
          </Overlay>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#ecf0f1",
  },
  super: {
    margin: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },
  sub: {
    marginLeft: 10,
    fontSize: 14,
    color: "black",
  },
  searchtext: {
    color: "black",
  },
  searchbox: {
    height: "10%",
    width: "100%",
    backgroundColor: "dodgerblue",
  },
  overlayText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  btnstyle: {
    marginBottom: 10,
  },
});
