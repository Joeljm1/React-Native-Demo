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
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Inp from "@/components/input";
import Providers from "@/components/authProviders";
import { Link } from "expo-router";

interface errors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [errors, setErrors] = useState<errors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleLogin() {
    const newErrors: errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    if (username.trim().length < 5 || username.trim().length > 16) {
      newErrors.username = "Username should be 5-16 characters";
    }

    if (!email.includes("@")) {
      newErrors.email = "Email should include an @";
    }
    if (password.trim() == "") {
      newErrors.password = "Password is required";
    }

    if (confPassword.trim() == "") {
      newErrors.confirmPassword = "Password is required";
    }
    setErrors(newErrors);
    if (newErrors.username != "" || newErrors.password != "") {
      return;
    }
    setUsername("");
    setPassword("");
  }
  return (
    <SafeAreaView style={st.centered}>
      <View style={st.flex}>
        <View style={st.top}>
          <View style={st.text}>
            <View>
              <Text style={st.signup}>SIGN UP</Text>
              <Text>
                Already Have an account?
                <Link href="/login">
                  {" "}
                  <Text style={st.login}>Login</Text>
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
              inp={email}
              setInp={setEmail}
              placehoder="Email"
              error={errors.email}
            >
              <MaterialIcons name="email" size={24} color="black" />
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

            <Inp
              inp={confPassword}
              setInp={setConfPassword}
              placehoder="confirm password"
              error={errors.confirmPassword}
            >
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={24}
                color="black"
                style={{ paddingRight: 5 }}
              />
            </Inp>

            <Pressable style={st.button} onPress={handleLogin}>
              <TouchableOpacity>
                <Text>SIGN UP</Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </View>
        <View style={st.bottom}>
          <View style={st.dividerRow}>
            <View style={st.line} />
            <Text>OR</Text>
            <View style={st.line} />
          </View>
          <Text style={st.signInUsing}>Sign up using</Text>
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
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  bottom: {
    marginTop: "10%",
    flex: 4,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
  },
  text: {
    flex: 3,
  },

  form: {
    flex: 8,
  },
  signup: {
    fontWeight: "900",
    fontSize: 40,
    marginTop: 17,
    marginLeft: 35,
    marginBottom: 5,
  },
  login: {
    fontWeight: "900",
    marginLeft: 5,
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
});
