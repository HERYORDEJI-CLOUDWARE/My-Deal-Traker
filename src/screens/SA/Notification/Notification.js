import { Card, Text } from "native-base";
import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { navigate } from "../../../nav/RootNav";

const Notification = () => {
  const list = [
    "123456tre345tyhn",
    "12345tgfd345678i",
    "345tyuk4567ukmn",
    "wrtye45654e3456y",
  ];

  return (
    <View>
      <FlatList
        data={list}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => navigate("notificationScreen")} >
              <View style={{ marginHorizontal: 10 }}>
                <Card style={{ padding: 10 }}>
                  <Text>Transaction ID: #{item} </Text>
                  <Text>Notification: New offer</Text>
                </Card>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Notification;
