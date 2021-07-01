import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootStack from './nav/MainNav';

export default function Main() {
  return (
    <>
      <StatusBar style="dark" />
      <RootStack />
    </>
  );
}


