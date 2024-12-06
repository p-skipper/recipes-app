import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../../global/globalStyles";
import { useColorMode } from "../context/ColorModeContext";

export const Header = () => {
  const { isDarkMode } = useColorMode();
  const styles = globalStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerView}>
        {/* Logomarca  */}
        <Image
          source={require("../../assets/logo-horizontal.png")}
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
};