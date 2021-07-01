import * as React from 'react';
import { Alert } from 'react-native';

export const navigationRef = React.createRef();

export const isMountedRef = React.createRef();


// export function navigate(name, params) {
//   navigationRef.current?.navigate(name, params);
// }

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    Alert.alert('Initializing app');
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}