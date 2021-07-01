import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React from 'react';
import { Text, View, TextProps, TextStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './src/Main';
import { Ionicons } from '@expo/vector-icons';
import { isMountedRef, navigationRef } from './src/nav/RootNav';
import { Root } from 'native-base';
import { Provider as UserProvider } from './src/context/UserContext';
import { LogBox } from 'react-native';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';
import _colors from './src/constants/colors';

// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
	const [loaded] = useFonts({
		'pop-black': require('./src/assets/fonts/Poppins-Black.ttf'),
		'pop-black-italic': require('./src/assets/fonts/Poppins-BlackItalic.ttf'),
		'pop-bold': require('./src/assets/fonts/Poppins-Bold.ttf'),
		'pop-bold-italic': require('./src/assets/fonts/Poppins-BoldItalic.ttf'),
		'pop-extra-bold': require('./src/assets/fonts/Poppins-ExtraBold.ttf'),
		'pop-extra-bold-italic': require('./src/assets/fonts/Poppins-ExtraBoldItalic.ttf'),
		'pop-extra-light': require('./src/assets/fonts/Poppins-ExtraLight.ttf'),
		'pop-extra-light-italic': require('./src/assets/fonts/Poppins-ExtraLightItalic.ttf'),
		'pop-italic': require('./src/assets/fonts/Poppins-Italic.ttf'),
		'pop-light': require('./src/assets/fonts/Poppins-Light.ttf'),
		'pop-light-italic': require('./src/assets/fonts/Poppins-LightItalic.ttf'),
		'pop-medium': require('./src/assets/fonts/Poppins-Medium.ttf'),
		'pop-medium-italic': require('./src/assets/fonts/Poppins-MediumItalic.ttf'),
		'pop-reg': require('./src/assets/fonts/Poppins-Regular.ttf'),
		'pop-semibold': require('./src/assets/fonts/Poppins-SemiBold.ttf'),
		'pop-semibold-italic': require('./src/assets/fonts/Poppins-SemiBoldItalic.ttf'),
		'pop-thin': require('./src/assets/fonts/Poppins-Thin.ttf'),
		'pop-thin-italic': require('./src/assets/fonts/Poppins-ThinItalic.ttf'),
		Roboto: require('native-base/Fonts/Roboto.ttf'),
		Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
		...Ionicons.font,
	});

	React.useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	}, []);

	// default props for Text components.
	const customTextProps = {
		style: {
			// fontSize: RFValue(14),
			fontFamily: 'pop-reg',
		},
		selectable: true,
	};

	//default props for TextInput Component
	const customTextInputProps = {
		style: {
			backgroundColor: 'transparent',
			flex: 1,
			// fontSize: RFValue(14),
			fontFamily: 'pop-reg',
			color: _colors.black,
		},
		// multiline: true,
	};

	//load default component props on app start
	React.useEffect(() => {
		setCustomText(customTextProps);
		setCustomTextInput(customTextInputProps);
	});

	if (!loaded) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				{/* <ActivityIndicator color={colors.brown} size="large" />{" "} */}
			</View>
		);
	}

	return (
		<>
			<NavigationContainer ref={navigationRef}>
				<SafeAreaProvider>
					<UserProvider>
						<Root>
							<Main />
						</Root>
					</UserProvider>
				</SafeAreaProvider>
			</NavigationContainer>
		</>
	);
}
