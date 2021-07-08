import { Entypo } from '@expo/vector-icons';
import { Text } from 'native-base';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import Appraisal from './Appraisal';
import CheckList from './CheckList';
import Financing from './Financing';
import Inspection from './Inspection';
import Repairs from './Repairs';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect } from 'react';
import _font from './../../../styles/fontStyles';

const SaConditions = ({ route, navigation }) => {
	const [view, setView] = useState('check');
	const { transaction } = route.params;

	console.log('\n\n', transaction);
	const [showModal, setShowModal] = useState(false);

	const rendered = () => {
		switch (view) {
			case 'financing':
				return <Financing />;
			case 'appraisal':
				return <Appraisal />;
			case 'inspection':
				return <Inspection transaction={transaction} />;
			case 'check':
				return <CheckList property={transaction} />;
			case 'repairs':
				return <Repairs transaction={transaction} property={transaction} />;
			// case "inspection":
			//   return <Inspection transaction={transaction} />;
			default:
				return <View />;
		}
	};

	// useEffect(() => {
	// 	console.log(property, '/|', transaction);
	// });

	return (
		<LogoPage navigation={navigation}>
			<TouchableOpacity
				onPress={() => setShowModal(true)}
				style={{
					alignSelf: 'flex-end',
					paddingVertical: RFValue(10),
				}}
			>
				<Entypo
					name='dots-three-vertical'
					size={RFValue(20)}
					color={colors.white}
				/>
			</TouchableOpacity>
			<ReactNativeModal
				isVisible={showModal}
				onBackdropPress={() => setShowModal(false)}
				onBackButtonPress={() => setShowModal(false)}
			>
				<View style={{ backgroundColor: colors.white }}>
					{/* <TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('financing');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Financing</Text>
					</TouchableOpacity> */}
					<TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('check');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Conditions</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('check');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Inspection</Text>
					</TouchableOpacity> */}
					{/* <TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('appraisal');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Appraisal</Text>
					</TouchableOpacity> */}
					<TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('repairs');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Repairs</Text>
					</TouchableOpacity>
				</View>
			</ReactNativeModal>
			{rendered()}
		</LogoPage>
	);
};

export default SaConditions;

const styles = StyleSheet.create({
	dropdownText: {
		..._font.Medium,
		textAlign: 'center',
		// paddingVertical: RFValue(10),
	},

	dropdownTextWrapper: { paddingVertical: RFValue(10) },
});
