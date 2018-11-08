// @flow

import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native-web";

const styles = StyleSheet.create({
  root: {
    textAlign: "center"
  },
  largeText: {
    fontSize: "40px",
    fontWeight: "bold"
  }
});

class App extends Component {
  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.largeText}>
          Welcome to Noted.
          <br />
          Please take some notes.
        </Text>
      </View>
    );
  }
}

export default App;
