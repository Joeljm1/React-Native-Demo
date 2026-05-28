import React, { useState } from "react";
import {
  Modal,
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Inp from "@/components/input";
import Providers from "@/components/authProviders";

import { useSession } from "@/ctx";

interface errors {
  username: string;
  password: string;
}

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<errors>({
    username: "",
    password: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  const { signIn } = useSession();

  function handleLogin() {
    const newErrors: errors = {
      username: "",
      password: "",
    };
    if (username.trim().length < 5 || username.trim().length > 16) {
      newErrors.username = "Username should be 5-16 characters";
    }
    if (password.trim() == "") {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    if (newErrors.username != "" || newErrors.password != "") {
      return;
    }
    setUsername("");
    setPassword("");
    if (!valid()) {
      setModalVisible(true);
    } else {
      signIn(username);
      router.replace("/(tabs)/");
    }
  }
  function valid() {
    return username == "admin" && password == "1234";
  }
  return (
    <SafeAreaView style={st.centered}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={st.centeredView}>
          <View style={st.modalView}>
            <Text style={st.modalText}>Invalid username/password</Text>
            <Pressable
              style={[st.button2, st.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={st.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={st.flex}>
        <View style={st.top}>
          <View style={st.text}>
            <View>
              <Text style={st.login}>LOGIN</Text>
              <Text>
                Dont Have an account?{" "}
                <Link href="/signup">
                  <Text style={st.signUp}>Sign up</Text>
                </Link>
              </Text>
            </View>
          </View>
          <View style={st.form}>
            <Inp
              inp={username}
              setInp={setUsername}
              placehoder="username"
              error={errors.username}
            >
              <AntDesign name="user" size={24} color="black" />
            </Inp>
            <Inp
              inp={password}
              setInp={setPassword}
              placehoder="password"
              error={errors.password}
            >
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="black"
                style={{ paddingRight: 5 }}
              />
            </Inp>
            <TouchableOpacity style={st.button} onPress={handleLogin}>
              <Text>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={st.bottom}>
          <View style={st.dividerRow}>
            <View style={st.line} />
            <Text>OR</Text>
            <View style={st.line} />
          </View>
          <Text style={st.signInUsing}>Sign in using</Text>
          <Providers />
        </View>
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  bottom: {
    marginTop: "20%",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
  },
  text: {
    flex: 5,
    marginTop: 50,
  },
  login: {
    fontWeight: "900",
    fontSize: 40,
    marginTop: 17,
    marginLeft: 35,
    marginBottom: 5,
  },
  signUp: {
    fontWeight: "900",
    marginLeft: 5,
  },
  form: {
    flex: 7,
  },
  button: {
    backgroundColor: "#0965c1",
    color: "white",
    height: 35,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  signInUsing: {
    marginBottom: "10%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
