import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Header = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>

      {/* Logomarca  */}
      <Image source={require("../../assets/logo-horizontal.png")} style={styles.logo}/>

    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5FFFF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#062E56",
    borderBottomWidth: 4,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 50,
    marginRight: 10,
  },
  title: {
    color: "#2c3e50",
    fontSize: 20,
    fontWeight: "bold",
  },
});
