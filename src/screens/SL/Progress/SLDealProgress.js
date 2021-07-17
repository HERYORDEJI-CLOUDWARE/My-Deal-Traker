import { Icon } from 'native-base';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../../constants/colors';
import LogoPage from '../../../components/LogoPage';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const SLDealProgress = ({ transaction, isLoading }) => {
	return (
		<LogoPage style={{ flex: 1 }}>
			<View style={{}}>
				<Text style={styles.title}>DEAL PROGRESS</Text>
				<Text style={{ color: colors.lightGrey }}>
					Process tracker for your current deal
				</Text>
			</View>

			<View style={{ marginTop: RFValue(20) }}>
				{/*Property*/}
				<View style={{ marginBottom: RFValue(20) }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={styles.doneCircle} />
						<Text style={styles.titleText}>Property</Text>
					</View>
					<View
						style={{
							borderLeftWidth: RFValue(1),
							paddingLeft: RFValue(20),
							marginLeft: RFValue(10),
							marginTop: RFValue(0),
							borderLeftColor: colors.doneCircle,
						}}
					>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Interested Purchaser</Text>
							<Text style={styles.status}>
								{transaction?.show_interest_status != '0' ? 'Completed' : ''}
							</Text>
						</View>

						<View style={styles.action_status}>
							<Text style={styles.progressText}>Show Request</Text>
							<Text style={styles.status}>
								{transaction?.show_property_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Make an offer</Text>
							<Text style={styles.status}>
								{transaction?.make_offer_initiation_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
					</View>
				</View>

				{/*Condition*/}
				<View style={{ marginBottom: RFValue(20) }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={styles.inProgressCircle} />
						<Text style={styles.titleText}>Condition</Text>
						<View style={{ flex: 1, alignSelf: 'flex-end' }}>
							{/* <Text style={{ ...styles.status }}>2 days left</Text> */}
						</View>
					</View>

					<View
						style={{
							borderLeftWidth: RFValue(1),
							paddingLeft: RFValue(20),
							marginLeft: RFValue(10),
							marginTop: RFValue(0),
							borderLeftColor: colors.doneCircle,
						}}
					>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Financing</Text>
							<Text style={{ ...styles.status }}>
								{transaction?.financing_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Inspection</Text>
							<Text style={{ ...styles.status }}>
								{transaction?.inspection_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Appraisal</Text>
							<Text style={{ ...styles.status }}>
								{transaction?.appraisal_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
						<View style={styles.action_status}>
							<Text style={styles.progressText}>Repairs</Text>
							<Text style={{ ...styles.status }}>
								{transaction?.repairs_status != '0'
									? 'Completed'
									: 'Not completed'}
							</Text>
						</View>
					</View>
				</View>

				<View style={{ marginBottom: RFValue(20) }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={styles.notDoneCircle} />
						<Text style={styles.titleText}>Closing</Text>
						<Text
							style={{
								...styles.titleText,
								color: colors.lightGrey,
								marginHorizontal: RFValue(10),
							}}
						>
							{transaction?.closing_status != '0'
								? 'Completed'
								: 'Not completed'}
						</Text>
					</View>

					<View
						style={{
							borderLeftWidth: RFValue(1),
							paddingLeft: RFValue(20),
							marginLeft: RFValue(10),
							marginTop: RFValue(0),
							borderLeftColor: colors.doneCircle,
						}}
					>
						<View>
							<Text style={styles.progressText}>Lawyer</Text>
						</View>
						<View>
							<Text style={styles.progressText}>Mortgage Broker</Text>
						</View>
					</View>
				</View>

				{/*Closing*/}
				<View style={{ marginBottom: RFValue(20) }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={styles.notDoneCircle} />
						<Text style={styles.titleText}>Closing</Text>
					</View>

					<View
						style={{
							borderLeftWidth: RFValue(1),
							paddingLeft: RFValue(20),
							marginLeft: RFValue(10),
							marginTop: RFValue(0),
							borderLeftColor: colors.doneCircle,
						}}
					>
						<View style={{ height: 40 }} />
					</View>
				</View>
			</View>
		</LogoPage>
	);
};

export default SLDealProgress;

const styles = StyleSheet.create({
	headerWrapper: { marginBottom: RFValue(10) },
	title: {
		..._font.Big,
		color: colors.white,
		fontSize: RFValue(20),
		lineHeight: RFValue(22),
	},
	subtitle: { ..._font.Small, color: colors.lightGrey, fontSize: RFValue(14) },
	doneCircle: {
		width: RFValue(20),
		height: RFValue(20),
		backgroundColor: colors.doneCircle,
		borderRadius: RFValue(30),
		marginRight: RFValue(10),
	},
	titleText: {
		..._font.Medium,
		color: colors.white,
		fontSize: RFValue(18),
	},
	progressText: {
		..._font.Small,
		color: colors.lightGrey,
		fontSize: RFValue(14),
		paddingVertical: RFValue(5),
	},
	inProgressCircle: {
		borderColor: colors.doneCircle,
		borderWidth: RFValue(2),
		width: RFValue(20),
		height: RFValue(20),
		borderRadius: RFValue(30),
		marginRight: RFValue(10),
	},
	notDoneCircle: {
		backgroundColor: colors.lightGrey,
		width: RFValue(20),
		height: RFValue(20),
		borderRadius: RFValue(30),
		marginRight: RFValue(10),
	},
	action_status: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	status: {
		..._font.Small,
		fontSize: RFValue(14),
		paddingVertical: RFValue(5),
		color: colors.white,
	},
});