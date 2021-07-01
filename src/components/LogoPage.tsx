import { Container, Content, Text } from 'native-base';
import React from 'react';
import * as RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';
import CustomHeader from './CustomHeader';
import { RFValue } from 'react-native-responsive-fontsize';
import { Context as UserContext } from '../context/UserContext';
import _font from '../styles/fontStyles';
import * as NB from 'native-base';
import { useNavigation } from '@react-navigation/native';

const LogoPage = ({ children, notShow, title, dontShow }) => {
	const {
		state: { user, subStatus },
		logout,
		fetchSubStatus,
	} = React.useContext(UserContext);

	// navigation instance
	const navigation = useNavigation();

	return (
		<Container style={styles.container}>
			{!dontShow ? (
				<CustomHeader
					title={title}
					navigation={navigation}
					style={{ marginTop: -30 }}
				/>
			) : null}
			<RN.View
				style={{
					alignSelf: 'flex-end',
					paddingBottom: 10,
					marginRight: 20,
					zIndex: -99999,
					marginTop: 37,
				}}
			>
				{/* {!notShow && (
					<RN.Image
						source={require('../assets/img/app_logo.png')}
						style={{ width: 70, height: 70, opacity: 0.8, borderWidth: 0 }}
					/>
				)} */}
			</RN.View>
			<Content>
				<React.Fragment>{children}</React.Fragment>
			</Content>
			{/* Logout button */}
			<RN.Pressable style={styles.logoutButtonWrapper} onPress={logout}>
				<NB.Icon
					name={'logout'}
					type={'MaterialCommunityIcons'}
					style={styles.logoutButtonIcon}
				/>
				<RN.Text style={styles.logoutButtonTitle}>Log out</RN.Text>
			</RN.Pressable>
		</Container>
	);
};

export default LogoPage;

const styles = RN.StyleSheet.create({
	container: {
		backgroundColor: colors.bgBrown,
		paddingHorizontal: RFValue(20),
		flex: 1,
	},
	logoutButtonTitle: { ..._font.Medium, color: colors.white },
	logoutButtonIcon: {
		color: colors.white,
		fontSize: RFValue(20),
		paddingRight: RFValue(10),
	},
	logoutButtonWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: RFValue(10),
	},
});
