import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, ScrollView } from "react-native";

function FAQ(props) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 20 }}>
          Greetings From hospitaltracker Team,
        </Text>
        <Text style={{ fontSize: 15 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", paddingBottom: 10 }}>
            As a COVID 19 Patient under home isolation,what should I do?
          </Text>
          {"\n"}
          {"\n"}
          The patient must ensure that he/she has Arogya Setu app with all
          notifications and location tracking 24X7. Also, patient must adhere to
          following instructions at all times during isolation:{"\n"}
          {"\n"}
          Masks Patient should at all times use a triple layer medical mask.
          Discard mask after 8 hours of use or earlier if they become wet or
          visibly soiled. Mask should be discarded only after disinfecting it
          with 1% Sodium Hypo-chlorite.{"\n"}
          {"\n"}
          Physical Distancing Patient must stay in the identified room and away
          from other people in home, especially elderlies and those with
          comorbid conditions like hypertension, cardiovascular disease, renal
          disease etc. Don’t share personal items with other people.{"\n"}
          {"\n"}
          <Text style={{ fontSize: 15, fontWeight: "bold", paddingBottom: 10 }}>
            What can I do to protect myself and prevent the spread of disease
            {"\n"}
            {"\n"}
          </Text>
          Protection measures for everyone{"\n"}
          {"\n"}
          Stay aware of the latest information on the COVID-19 outbreak,
          available on the national,state and local public health authority.
          Many countries around the world have seen cases of COVID-19 and
          several have seen outbreaks. Authorities in China and some other
          countries have succeeded in slowing or stopping their outbreaks.
          However, the situation is unpredictable so check regularly for the
          latest news.{"\n"}
          {"\n"}
          Thank you,{"\n"}
          Your hospitaltracker Team
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default FAQ;
