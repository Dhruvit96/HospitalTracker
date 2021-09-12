import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
} from "react-native";
import AppButton from "../componants/AppButton";

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/hospital.jpg")}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo2.jpg")}
        />
        <Text>Each Life Matters</Text>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 27,
            marginBottom: 40,
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 2.5,
            textShadowColor: "dodgerblue",
            textShadowRadius: 30,
            color: "white",
          }}
        >
          Welcome{"\n"}To{"\n"}HospitalTracker
        </Text>
        <AppButton
          title="  Hospital Login  "
          onPress={() => navigation.navigate("Login")}
        />
        <AppButton
          title="  Find Hospitals  "
          onPress={() => navigation.navigate("Search")}
        />
        <AppButton
          title="  Covid-19   FAQs   "
          onPress={() => navigation.navigate("FAQs")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
  },
});
