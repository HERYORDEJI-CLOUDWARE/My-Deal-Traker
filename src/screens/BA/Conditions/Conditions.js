import { Entypo } from '@expo/vector-icons';
import {} from 'native-base';
import React from 'react';
import { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../constants/colors';
import Appraisal from './Appraisal';
import CheckList from './CheckList';
import Financing from './Financing';
import Inspection from './Inspection';
import Repairs from './Repairs';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import LogoPage from '../../../components/LogoPage';
import Notes from './Notes';

const Conditions = ({ notAgent }) => {
	const navigation = useNavigation();
	const route = useRoute();

	const { transaction, property } = route.params;

	const [view, setView] = useState('check');

	const [showModal, setShowModal] = useState(false);

	const rendered = () => {
		switch (view) {
			case 'financing':
				return <Financing transaction={transaction} />;
			case 'inspection':
				return <Inspection transaction={transaction} property={property} />;
			case 'appraisal':
				return <Appraisal />;
			case 'notes':
				return (
					<Notes
						transaction={transaction}
						property={property}
						setView={setView}
						notAgent={notAgent}
					/>
				);
			case 'repairs':
				return (
					<Repairs
						// repairReqSelectModal={repairReqSelectModal}
						transaction={transaction}
						property={property}
						setView={setView}
						notAgent={notAgent}
					/>
				);
			case 'check':
				return (
					<CheckList
						repairReqSelectModal={repairReqSelectModal}
						transaction={transaction}
						property={property}
						route={{ params: { transaction, property } }}
						notAgent={false}
					/>
				);
			default:
				return <ActivityIndicator size='large' color={colors.white} />;
		}
	};

	const repairReqSelectModal = (
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
	);

	return (
		<LogoPage>
			{repairReqSelectModal}
			<ReactNativeModal
				isVisible={showModal}
				onBackdropPress={() => setShowModal(false)}
				onBackButtonPress={() => setShowModal(false)}
			>
				<View style={{ backgroundColor: colors.white }}>
					{!notAgent ? (
						<React.Fragment>
							<TouchableOpacity
								style={styles.dropdownTextWrapper}
								onPress={() => {
									setView('financing');
									setShowModal(false);
								}}
							>
								<Text style={styles.dropdownText}>Financing</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.dropdownTextWrapper}
								onPress={() => {
									setView('inspection');
									setShowModal(false);
								}}
							>
								<Text style={styles.dropdownText}>Inspection</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.dropdownTextWrapper}
								onPress={() => {
									setView('notes');
									setShowModal(false);
								}}
							>
								<Text style={styles.dropdownText}>Note</Text>
							</TouchableOpacity>
						</React.Fragment>
					) : null}
					{/* <TouchableOpacity
            onPress={() => {
              setView("appraisal");
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
					<TouchableOpacity
						style={styles.dropdownTextWrapper}
						onPress={() => {
							setView('check');
							setShowModal(false);
						}}
					>
						<Text style={styles.dropdownText}>Requirement</Text>
					</TouchableOpacity>
				</View>
			</ReactNativeModal>

			<View style={{ flex: 1, height: '100%' }}>{rendered()}</View>
		</LogoPage>
	);
};

export default Conditions;

const styles = StyleSheet.create({
	dropdownText: {
		..._font.Medium,
		textAlign: 'center',
		// paddingVertical: RFValue(10),
	},

	dropdownTextWrapper: { paddingVertical: RFValue(10) },
});
