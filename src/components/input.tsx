import React from "react";
import {
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";

type props = {
  inp: string;
  setInp: React.Dispatch<React.SetStateAction<string>>;
  children: React.ReactNode;
  placehoder: string;
  error: string;
};

export default function InpBar({
  children,
  inp,
  setInp,
  placehoder,
  error,
}: props) {
  return (
    <View style={st.container}>
      <View style={[st.body, error && st.errorBar]}>
        {children}
        <TextInput
          value={inp}
          style={st.txtBar}
          onChangeText={setInp}
          placeholder={placehoder}
          placeholderTextColor="#999999"
        />
      </View>
      {error !== "" && <Text style={st.errorText2}>{error}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    width: "85%",
    maxWidth: 320,
    marginVertical: 5,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: "85%",
    borderColor: "#ccc",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  txtBar: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingLeft: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginLeft: 15,
  },
  errorBar: {
    borderColor: "red",
  },
  errorText2: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
});
