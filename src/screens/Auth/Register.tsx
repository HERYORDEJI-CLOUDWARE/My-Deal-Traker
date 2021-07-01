import React, { useContext, useState } from 'react';
import * as RN from 'react-native';
import * as NB from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import colors from '../../constants/colors';
import CountryPicker from 'react-native-country-picker-modal';
import { CountryCode, Country } from '../../components/type';
import { useFormik } from 'formik';
import { StackNavigationProp } from '@react-navigation/stack';
import { Context as UserContext } from '../../context/UserContext';
import { Toast } from 'native-base';
import BarPasswordStrengthDisplay from '../../components/PasswordBar';
import scorePassword from '../../components/utils/score-password';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RegSchema, authFormInitialValues } from '../../utils/dataSchema';
import _font from '../../styles/fontStyles';
import _colors from './../../constants/colors';
import ButtonPrimaryBig from '../../components/ButtonPrimaryBig';
import ButtonSecondaryBig from '../../components/ButtonSecondaryBig';

const { width } = RN.Dimensions.get('window');

interface HomeNavProp {
	navigation: StackNavigationProp<any, any>;
}

const Register = ({ navigation }: HomeNavProp) => {
	const box = useSafeAreaInsets();

	const [countryCode, setCountryCode] = useState<CountryCode>('CA');

	const [showPass, setShowPass] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { registerAccount } = useContext(UserContext);

	const { values, handleChange, handleSubmit, setFieldValue, errors, touched } =
		useFormik({
			initialValues: authFormInitialValues,
			onSubmit: (values) => {
				// alert(JSON.stringify(values, null, 2));
				requestAccount();
			},
			validationSchema: RegSchema,
		});

	const variations = {
		digits: /\d/,
		lower: /[a-z]/,
		upper: /[A-Z]/,
		nonWords: /\W/,
	};

	const score = scorePassword(values.password, 3, 100, variations);

	const onSelectCountry = (scountry: Country) => {
		setCountryCode(scountry.cca2);
		setFieldValue('country', scountry.name);
		// console.log(scountry);
	};

	const requestAccount = async () => {
		try {
			if (score < 35) {
				return Toast.show({
					type: 'danger',
					text: 'Password too weak',
				});
			}
			setIsLoading(true);
			const data = new FormData();
			data.append('fullname', values.fullName);
			data.append('email', values.email);
			data.append('password', values.password);
			data.append('confirm_password', values.passwordConfirmation);
			data.append('phone', values.telephone);
			data.append('country', values.country);
			data.append('role', values.registerAs);

			await registerAccount(data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	return (
		<NB.Container style={{ ...styles.container }}>
			<RN.View style={styles.header}>
				<RN.Text style={styles.hello}>Hello,</RN.Text>
				<RN.Text style={styles.welcome}>Welcome</RN.Text>
			</RN.View>

			<RN.View style={styles.signUpContainer}>
				<RN.View style={styles.signUpWrapper}>
					<RN.Text style={styles.signUp}>Sign Up</RN.Text>
				</RN.View>
			</RN.View>

			<NB.Content>
				<RN.View style={styles.formArea}>
					<KeyboardAwareScrollView>
						<CustomInput
							placeholder='Full Name'
							label='Full Name'
							value={values.fullName}
							onChangeText={handleChange('fullName')}
							error={errors.fullName}
							touched={touched.fullName}
						/>

						<CustomInput
							placeholder='Email Address'
							label='Email Address'
							rightIconName=''
							keyboardType={'email-address'}
							value={values.email}
							onChangeText={handleChange('email')}
							error={errors.email}
							touched={touched.email}
						/>

						{/* {values.password && ( */}
						<BarPasswordStrengthDisplay password={values.password} />
						{/* )} */}

						<CustomInput
							placeholder='Password'
							label='Password'
							value={values.password}
							autoCapitalize='none'
							onChangeText={handleChange('password')}
							error={errors.password}
							touched={touched.password}
							password={true}
						/>

						<CustomInput
							placeholder='Confirm Password'
							label='Confirm Password'
							value={values.passwordConfirmation}
							onChangeText={handleChange('passwordConfirmation')}
							error={errors.passwordConfirmation}
							touched={touched.passwordConfirmation}
							password={true}
						/>

						<CustomInput
							placeholder='Telephone'
							label='Telephone'
							value={values.telephone}
							onChangeText={handleChange('telephone')}
							keyboardType='number-pad'
							error={errors.telephone}
							touched={touched.telephone}
						/>

						<RN.View style={styles.countryPickerWrapper}>
							<CountryPicker
								{...{
									countryCode,
									withFilter: true,
									// withFlag: true,
									withCountryNameButton: true,
									// withEmoji: true,
								}}
								onSelect={onSelectCountry}
								visible={false}
								withAlphaFilter={false}
							/>
						</RN.View>
					</KeyboardAwareScrollView>

					<ButtonPrimaryBig
						title={isLoading ? 'Loading...' : 'Sign Up'}
						onPress={handleSubmit}
						containerStyle={{ marginVertical: RFValue(20) }}
					/>

					<ButtonSecondaryBig
						title={'Already have an account? Sign In'}
						onPress={() => navigation.navigate('loginScreen')}
						// containerStyle={{ marginVertical: RFValue(20) }}
					/>
				</RN.View>
			</NB.Content>
		</NB.Container>
	);
};

export default Register;

const styles = RN.StyleSheet.create({
	container: {
		backgroundColor: colors.bgBrown,
		paddingTop: RFValue(40),
	},
	content: {},
	formArea: {
		backgroundColor: '#fff',
		flex: 1,
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(30),
	},
	line: {
		height: 1,
		width: width / 4,
		backgroundColor: colors.powerder,
	},
	data: {
		maxWidth: RFValue(250),
		padding: RFValue(10),
		marginTop: RFValue(7),
		backgroundColor: '#ddd',
		borderColor: '#888',
		borderWidth: 1 / RN.PixelRatio.get(),
		color: '#777',
	},
	header: {
		backgroundColor: colors.bgBrown,
		justifyContent: 'center',
		paddingHorizontal: RFValue(30),
		marginBottom: RFValue(10),
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
	countryPickerWrapper: {
		paddingHorizontal: RFValue(10),
		// marginVertical: RFValue(15),
		borderWidth: RFValue(1),
		borderRadius: RFValue(10),
		// paddingVertical: RFValue(10),
		borderColor: _colors.fair,
		height: RFValue(50),
		justifyContent: 'center',
	},
	signUp: {
		..._font.H6,
		color: colors.brown,
		paddingVertical: RFValue(5),
		fontFamily: 'pop-medium',
	},
	signUpWrapper: {
		backgroundColor: colors.white,
		width: width * 0.5,
		borderTopLeftRadius: RFValue(20),
		justifyContent: 'center',
		alignItems: 'center',
	},
	signUpContainer: { backgroundColor: colors.bgBrown, alignItems: 'flex-end' },
});
