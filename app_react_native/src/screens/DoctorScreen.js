import React, { useState } from "react";
import { StyleSheet, Image, View, Alert } from "react-native";
import { Header, Button, Text, Overlay, Input } from "react-native-elements";
import { connect } from "react-redux";
import { handleResponse } from "../actions/user.actions";
import config from "../../config";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const ListItem = ({ item, refresh, token }) => {
  const [name, setName] = useState(item.name);
  const [degree, setDegree] = useState(item.degree);
  const [speciality, setSepeciality] = useState(item.speciality);
  const [image, setImage] = useState(item.image);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ padding: 20, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: 107, height: 142, resizeMode: "contain" }}
            source={{ uri: config.URL + item.image }}
          />
        </View>
        <View
          style={{
            flex: 1.6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 22 }}>
            {item.name + "\n\n" + item.degree + "\n\n" + item.speciality}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          title="Edit"
          containerStyle={{ flex: 1, padding: 5 }}
          onPress={() => setIsUpdate(true)}
        />
        <Button
          title="Delete"
          containerStyle={{ flex: 1, padding: 5 }}
          onPress={() => {
            Alert.alert("Delete data", "Do you want to delete data?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  fetch(`${config.API}/doctor/${item.id}`, {
                    method: "Delete",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + token,
                    },
                  }).then(() => {
                    refresh();
                    alert("Data Deleted");
                  });
                },
              },
            ]);
          }}
        />
      </View>
      <Overlay visible={isUpdate} onBackdropPress={() => setIsUpdate(false)}>
        {image ? (
          <Image
            style={{
              width: 134,
              height: 177,
              alignSelf: "center",
              resizeMode: "contain",
            }}
            source={{ uri: image[0] == "p" ? config.URL + item.image : image }}
          />
        ) : null}
        <Input
          label="Name"
          containerStyle={{ width: 280 }}
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />
        <Input
          label="Degree"
          containerStyle={{ width: 280 }}
          value={degree}
          onChangeText={(text) => {
            setDegree(text);
          }}
        />
        <Input
          label="Speciality"
          containerStyle={{ width: 280 }}
          value={speciality}
          onChangeText={(text) => {
            setSepeciality(text);
          }}
        />
        <Button
          title={"Select Image"}
          onPress={async () => {
            const { status } =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert(
                "Sorry, we need camera roll permissions to make this work!"
              );
            }
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [3, 4],
              quality: 0.5,
            });
            if (!result.cancelled) {
              setImage(result.uri);
            }
          }}
        />
        <Button
          title={"Update"}
          loading={loading}
          containerStyle={{ marginTop: 10 }}
          onPress={() => {
            if (degree == "" || name == "" || speciality == "") {
              alert("All fields are required");
              setLoading(false);
              return;
            } else if (!image) {
              alert("Please select image");
              setLoading(false);
              return;
            } else {
              setLoading(true);
              const formData = new FormData();
              if (image[0] != "p") {
                let filename = image.split("/").pop();
                let match = /\.(\w+)$/.exec(image);
                let type = match ? `image/${match[1]}` : `image`;
                formData.append("image", {
                  uri: image,
                  name: filename,
                  type,
                });
              }
              formData.append("name", name);
              formData.append("degree", degree);
              formData.append("speciality", speciality);
              fetch(`${config.API}/doctor/${item.id}`, {
                method: "Put",
                body: formData,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + token,
                },
              })
                .then(handleResponse)
                .then(() => {
                  alert("Data Updated");
                  setIsUpdate(false);
                  setLoading(false);
                  refresh();
                })
                .catch((err) => {
                  console.error(err);
                  alert("Something went wrong try again later.");
                  setLoading(false);
                });
            }
          }}
        />
      </Overlay>
    </View>
  );
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      doctors: [],
      isAdd: false,
      loading: false,
      name: "",
      degree: "",
      speciality: "",
      image: "",
    };
  }

  getData = () => {
    fetch(`${config.API}/doctor/${this.props.user.id}`, {
      method: "Get",
      headers: { "Content-Type": "application/json" },
    })
      .then(handleResponse)
      .then((res) => {
        if (res.data.doctors) {
          this.setState({
            doctors: res.data.doctors,
          });
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  storeData() {
    if (
      this.state.degree == "" ||
      this.state.name == "" ||
      this.state.speciality == ""
    ) {
      alert("All fields are required");
      this.setState({ loading: false });
      return;
    } else if (!this.state.image) {
      alert("Please select image");
      this.setState({ loading: false });
      return;
    } else {
      this.setState({
        loading: true,
      });
      const formData = new FormData();
      let filename = this.state.image.split("/").pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      formData.append("image", {
        uri: this.state.image,
        name: filename,
        type,
      });
      formData.append("name", this.state.name);
      formData.append("degree", this.state.degree);
      formData.append("speciality", this.state.speciality);
      fetch(`${config.API}/doctor`, {
        method: "Post",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + this.props.user.token,
        },
      })
        .then(handleResponse)
        .then(() => {
          alert("Data Added");
          this.getData();
          this.setState({
            loading: false,
            isAdd: false,
            image: null,
            name: "",
            degree: "",
            speciality: "",
          });
        })
        .catch((err) => {
          console.error(err);
          alert("Something went wrong try again later.");
          this.setState({
            loading: false,
          });
        });
    }
  }

  async addImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
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
            text: "Doctors Data",
            style: { color: "#fff", fontSize: 20 },
          }}
        />
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                refresh={() => this.getData()}
                token={this.props.user.token}
              />
            )}
            keyExtractor={(item) => item.id}
            data={this.state.doctors}
          />
          <Overlay
            visible={this.state.isAdd}
            onBackdropPress={() => this.setState({ isAdd: false })}
          >
            {this.state.image ? (
              <Image
                style={{
                  width: 134,
                  height: 177,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
                source={{ uri: this.state.image }}
              />
            ) : null}
            <Input
              label="Name"
              containerStyle={{ width: 280 }}
              value={this.state.name}
              onChangeText={(text) => {
                this.setState({ name: text });
              }}
            />
            <Input
              label="Degree"
              containerStyle={{ width: 280 }}
              value={this.state.degree}
              onChangeText={(text) => {
                this.setState({ degree: text });
              }}
            />
            <Input
              label="Speciality"
              containerStyle={{ width: 280 }}
              value={this.state.speciality}
              onChangeText={(text) => {
                this.setState({ speciality: text });
              }}
            />
            <Button
              title={"Select Image"}
              onPress={() => {
                this.addImage();
              }}
            />
            <Button
              title={"Add"}
              loading={this.state.loading}
              containerStyle={{ marginTop: 10 }}
              onPress={() => {
                this.storeData();
              }}
            />
          </Overlay>
          <Button
            title={"Add new data"}
            containerStyle={{
              position: "absolute",
              bottom: 20,
              width: "80%",
              alignSelf: "center",
            }}
            onPress={() => this.setState({ isAdd: true })}
          />
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
