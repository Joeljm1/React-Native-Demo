import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import FadeInOut from "@/components/fadeInOut";

export interface Resp {
  results: Result[];
  info: Info;
}

export interface Result {
  gender: string;
  name: Name;
  location: Location;
  email: string;
  login: Login;
  dob: Dob;
  registered: Registered;
  phone: string;
  cell: string;
  id: Id;
  picture: Picture;
  nat: string;
}

export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Location {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: any;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Street {
  number: number;
  name: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface Dob {
  date: string;
  age: number;
}

export interface Registered {
  date: string;
  age: number;
}

export interface Id {
  name: string;
  value?: string;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface Info {
  seed: string;
  results: number;
  page: number;
  version: string;
}

function gender(g: string) {
  return g.toLowerCase() == "male" ? "M" : "F";
}

export default function App() {
  const [data, setData] = useState<Resp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("https://randomuser.me/api/?results=20", {
          signal: controller.signal,
        });
        const jsonData = (await resp.json()) as Resp;
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occured");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    fetchData();
  }, []);

  function Header() {
    return (
      <View style={[st.row]}>
        <Text style={[st.photo, st.headingCell]}>Photo</Text>
        <Text style={[st.name, st.headingCell]}>Name</Text>
        <Text style={[st.email, st.headingCell]}>Email</Text>
        <Text style={[st.Gender, st.headingCell]}>Gender</Text>
        <Text style={[st.Country, st.headingCell]}>Country</Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={{ height: "100%" }}>
        <Header />

        <FadeInOut style={{ height: "100%" }}>
          <Skeleton />
        </FadeInOut>
      </View>
    );
  } else if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  } else {
    function Row({ item: item, index }: { item: Result; index: number }) {
      return (
        <View style={[st.bodyRow]}>
          <View style={[st.photo, st.cell]}>
            <Image
              source={{ uri: item.picture.thumbnail }}
              style={[st.thumbnail, st.cell]}
            />
          </View>
          <Text style={[st.name, st.cell]}>
            {`${item.name.first} ${item.name.last}`}
          </Text>

          <Text style={[st.email, st.cell]}>{item.email}</Text>

          <Text style={[st.Gender, st.cell]}>{gender(item.gender)}</Text>

          <Text style={[st.Country, st.cell]}>{item.location.country}</Text>
        </View>
      );
    }
    return (
      <View style={{ height: "100%" }}>
        <Header />
        <FlatList
          data={data?.results || []}
          renderItem={Row}
          keyExtractor={(item) => item.login.uuid} // UUID is the safest unique key here
        />
      </View>
    );
  }
}

function Skeleton() {
  return (
    <View style={{ flex: 1 }}>
      {Array.from({ length: 7 }).map((_, idx) => {
        return <SkeletonRow key={idx} />;
      })}
    </View>
  );
}
function SkeletonRow() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        borderBottomWidth: 1,
        borderColor: "#abb5af",
        borderWidth: 1,
      }}
    >
      <View style={st.SkeletonRow}></View>

      <View style={st.SkeletonRow}></View>
    </View>
  );
}

const st = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  bodyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  headingCell: {
    justifyContent: "center",
    textAlign: "center",
  },
  photo: {
    flex: 3,
  },
  name: {
    flex: 4,
  },
  email: {
    flex: 4,
  },
  Gender: {
    flex: 2,
  },
  Country: {
    flex: 3,
  },
  thumbnail: {
    maxWidth: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#CCC",
  },
  cell: {
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  SkeletonRow: {
    backgroundColor: "#abb5af",
    height: "15%",
    borderRadius: 20,
    marginHorizontal: 30,
  },
});
