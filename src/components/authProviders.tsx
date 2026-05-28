import { StyleSheet, Text, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
export default function AuthProviders() {
  const size = 60;
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      <AntDesign name="google" size={size} color="orginal" />
      <Entypo name="facebook" size={size} color="blue" />
      <AntDesign name="apple" size={size} color="grey" />
      <AntDesign name="twitter" size={size} color="black" />
    </View>
  );
}
