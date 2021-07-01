import React, { useCallback, useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import LogoPage from "../../components/LogoPage";
import { Text } from "react-native";
import colors from "../../constants/colors";
import { Input } from "react-native-elements";
import { View } from "react-native";
import { displayError, fetchAuthToken } from "../../utils/misc";
import appApi from "../../api/appApi";
import { Toast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import { Context as UserContext } from "../../context/UserContext";
import * as DocumentPicker from "expo-document-picker";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { Linking } from "react-native";
import * as WebBrowser from 'expo-web-browser';


const Uploads = ({ route, navigation }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [myUploads, setMyUploads] = useState([]);
  const {
    state: { user },
  } = useContext(UserContext);

  const { transaction } = route.params;

  useFocusEffect(
    useCallback(() => {
      fetchUploads();
    }, [])
  );


  const fetchUploads = async () => {
    try {
      const token = await fetchAuthToken();
      const response = await appApi.get(
        `/get_document_by_transaction.php?transaction_id=${transaction.transaction_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.response.status == 200) {
        setMyUploads(response.data.response.data);
        Toast.show({
          type: "success",
          text: response.data.response.message,
        });
      } else {
        Toast.show({
          type: "warning",
          text: response.data.response.message,
        });
      }
    } catch (error) {
      displayError(error);
    }
  };

  const uploadFile = async () => {
    try {
      if (!text || !file) {
        return Toast.show({
          type: "danger",
          text: "Select file and enter filename/info",
        });
      }
      setIsUploading(true);
      const token = await fetchAuthToken();
      const data = new FormData();
      data.append("user_id", user.unique_id);
      data.append("transaction_id", transaction.transaction_id);
      data.append("document_name", text);
      if (file) {
        data.append("file", {
          name: file.name,
          type: "application/octet",
          uri: file.uri,
        });
      }
      const response = await appApi.post(`/upload_document.php`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsUploading(false);
      setText("");
      setFile();
      fetchUploads();
    } catch (error) {
      setIsUploading(false);
      displayError(error);
    }
  };

  const onUpload = async () => {
    const data = await DocumentPicker.getDocumentAsync();
    if (data.type === "success") {
      setFile(data);
    }
  };

  return (
    <LogoPage navigation={navigation} title="Files & Uploads" >
      <FlatList
        ListHeaderComponent={
          <View>
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              <Input
                placeholder="Enter file name/info"
                value={text}
                onChangeText={setText}
                inputStyle={{ color: colors.white }}
                placeholderTextColor={colors.white}
              />
              {file && <Text style={{ paddingBottom: 10 }}>{file.name} </Text>}
              <TouchableOpacity
                style={[styles.btn, { alignSelf: "flex-start" }]}
                onPress={onUpload}
              >
                <Text>Select new file</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.btn,
                { marginTop: 20, alignSelf: "stretch", marginHorizontal: 20 },
              ]}
              onPress={uploadFile}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.bgBrown} />
              ) : (
                <Text style={{ textAlign: "center" }}>{"Add File"}</Text>
              )}
            </TouchableOpacity>
            <View>
              <Text
                style={{ fontSize: 25, textAlign: "center", marginTop: 30 }}
              >
                Files
              </Text>
            </View>
          </View>
        }
        data={myUploads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View>
              <View
                style={{
                  borderWidth: 1,
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {item.document_name}{" "}
                </Text>

                <Text
                  onPress={async() => {
                    // Linking.openURL( "http://mydealtrackerweb.staging.cloudware.ng/" + item.image_url);
                    await WebBrowser.openBrowserAsync(item.image_url)
                  }}
                >
                  View
                </Text>
                {/* <Text>{item.image_url} </Text> */}
              </View>
            </View>
          );
        }}
      />
    </LogoPage>
  );
};

export default Uploads;

const styles = StyleSheet.create({
  btn: {
    alignSelf: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
