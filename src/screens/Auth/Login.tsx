import React, { useState } from 'react';
import * as RN from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import colors from '../../constants/colors';
import { useFormik } from 'formik';
import { Toast, ActionSheet } from 'native-base';
import * as NB from 'native-base';
import { displayError } from '../../utils/misc';
import { useContext } from 'react';
import { Context as UserContext } from '../../context/UserContext';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../styles/fontStyles';
import _colors from '../../constants/colors';
import ButtonPrimaryBig from '../../components/ButtonPrimaryBig';
import ButtonSecondaryBig from '../../components/ButtonSecondaryBig';

const { width } = RN.Dimensions.get('window');

const Login = ({ navigation }) => {
	const box = useSafeAreaInsets();

	const [showPass, setShowPass] = useState(false);
	const { userLogin } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(false);
	const [showSigninAsSheet, setShowSigninAsSheet] = useState(false);

	const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
		useFormik({
			initialValues: {
				email: '',
				password: '',
				signInAs: '',
			},
			onSubmit: async () => {
				await onLogin();
			},
		});

	const renderBottomToast = () => {
		return <Toast title={<Text>Yusuf</Text>} />;
	};

	const onLogin = async () => {
		try {
			if (!values.signInAs) {
				return Toast.show({
					type: 'danger',
					text: 'Please select what to sign in as',
					textStyle: { ..._font.Medium, color: '#FFF', fontSize: RFValue(12) },
				});
			}
			if (!values.email || !values.password) {
				return Toast.show({
					type: 'danger',
					text: 'Please enter your email and password',
					textStyle: { ..._font.Medium, color: '#FFF', fontSize: RFValue(12) },
				});
			}
			setIsLoading(true);
			const data = new FormData();
			data.append('email', values.email);
			data.append('password', values.password);
			data.append('role', values.signInAs);

			console.log(data);

			const res = await userLogin(data, values.signInAs);

			setIsLoading(false);

			// return
			// if (val.signInAs === "Buyer's Agent") {
			//   navigation.navigate("baStack");
			// }

			// if (val.signInAs === "Seller's Agent") {
			//   navigation.navigate("saStack");
			// }

			// if (val.signInAs === "Seller's Lawyer") {
			//   navigation.navigate("slStack");
			// }

			// if (val.signInAs === "Buyer's Lawyer") {
			//   navigation.navigate("blStack");
			// }
		} catch (error) {
			setIsLoading(false);
			displayError(error);
		}
	};

	let LOGIN_BUTTONS = [
		'Buyer',
		'Seller',
		"Buyer's Agent",
		"Seller's Agent",
		"Seller's Lawyer",
		"Buyer's Lawyer",
		'Mortgage Broker',
		'Cancel',
	];
	let LOGIN_CANCEL_INDEX = 7;

	const onLoginAsSheet = () => {
		ActionSheet.show(
			{
				style: { backgroundColor: '#FFFFFF' },
				options: LOGIN_BUTTONS,
				cancelButtonIndex: LOGIN_CANCEL_INDEX,
				title: 'Sign in as',
			},
			(buttonIndex) => {
				if (buttonIndex !== LOGIN_CANCEL_INDEX) {
					setFieldValue('signInAs', buttonIndex + 1);
				}
			},
		);
	};

	const onCloseSigninAsSheet = () => {};

	return (
		<NB.Container style={styles.container}>
			<RN.View style={styles.header}>
				<RN.Text style={styles.hello}>Hello,</RN.Text>
				<RN.Text style={styles.welcome}>Welcome</RN.Text>
			</RN.View>

			{/*Section Header*/}
			<RN.View style={styles.signInContainer}>
				<RN.View style={styles.signInWrapper}>
					<RN.Text style={styles.signIn}>Sign In</RN.Text>
				</RN.View>
			</RN.View>

			{/*Section Form */}
			<RN.View style={styles.formArea}>
				<RN.Pressable onPress={onLoginAsSheet} style={styles.loginAsWrapper}>
					<RN.Text style={styles.signInAs}>
						{LOGIN_BUTTONS[+values.signInAs - 1] || 'Sign In As'}
					</RN.Text>
				</RN.Pressable>

				<CustomInput
					placeholder='Email Address'
					label='Email Address'
					value={values.email}
					onChangeText={handleChange('email')}
					keyboardType={'email-address'}
					autoCapitalize='none'
					error={errors.email}
					touched={touched.email}
				/>

				<CustomInput
					placeholder='Password'
					label='Password'
					value={values.password}
					onChangeText={handleChange('password')}
					autoCapitalize='none'
					error={errors.password}
					touched={touched.password}
					password={true}
				/>

				<RN.Pressable
					style={styles.forgotWrapper}
					onPress={() => navigation.navigate('forgotPassword')}
				>
					<RN.Text style={styles.forgot}>Forgot password ?</RN.Text>
				</RN.Pressable>

				<ButtonPrimaryBig
					title={isLoading ? 'Loading...' : 'Sign In'}
					onPress={() => handleSubmit()}
					containerStyle={{ marginVertical: RFValue(20) }}
				/>

				<ButtonSecondaryBig
					title={'Not a Member? Sign Up'}
					onPress={() => navigation.navigate('regScreen')}
					// containerStyle={{ marginVertical: RFValue(30) }}
				/>
			</RN.View>

			{/*<Actionsheet isOpen={showSigninAsSheet} onClose={onCloseSigninAsSheet}>*/}
			{/*	<Actionsheet.Content>*/}
			{/*		<Actionsheet.Item>Option 1</Actionsheet.Item>*/}
			{/*		<Actionsheet.Item>Option 2</Actionsheet.Item>*/}
			{/*		<Actionsheet.Item>Option 3</Actionsheet.Item>*/}
			{/*	</Actionsheet.Content>*/}
			{/*</Actionsheet>*/}
		</NB.Container>
	);
};

export default Login;

const styles = RN.StyleSheet.create({
	container: {
		backgroundColor: colors.bgBrown,
		paddingTop: RFValue(40),
	},
	header: {
		backgroundColor: colors.bgBrown,
		justifyContent: 'center',
		paddingHorizontal: RFValue(30),
		marginBottom: RFValue(10),
	},
	formArea: {
		backgroundColor: '#fff',
		flex: 1,
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(30),
	},
	hello: {
		..._font.H1,
		fontFamily: 'pop-light',
		color: colors.white + '90',
	},
	welcome: {
		..._font.H1,
		fontFamily: 'pop-light',
		color: colors.white + '90',
		lineHeight: RFValue(35),
	},
	signIn: {
		..._font.H6,
		color: colors.brown,
		paddingVertical: RFValue(5),
		fontFamily: 'pop-medium',
	},
	signInWrapper: {
		backgroundColor: colors.white,
		width: width * 0.5,
		borderTopRightRadius: RFValue(20),
		justifyContent: 'center',
		alignItems: 'center',
	},
	signInContainer: { backgroundColor: colors.bgBrown },
	loginAsWrapper: {
		borderWidth: 1,
		borderRadius: RFValue(10),
		marginBottom: RFValue(20),
		paddingHorizontal: RFValue(10),
		justifyContent: 'center',
		height: RFValue(50),
		borderColor: _colors.fair,
	},
	signInAs: { ..._font.Medium, color: _colors.fair },
	forgotWrapper: {},
	forgot: { ..._font.Medium, color: _colors.fair, fontFamily: 'pop-reg' },
});