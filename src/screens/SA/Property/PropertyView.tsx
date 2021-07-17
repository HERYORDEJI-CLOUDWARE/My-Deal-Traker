import { AntDesign } from '@expo/vector-icons';
import { Text } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import LogoPage from '../../../components/LogoPage';
import colors from '../../../constants/colors';
import { navigate } from '../../../nav/RootNav';
import _font from '../../../styles/fontStyles';
import { fetchAuthToken, formatStatus } from '../../../utils/misc';
import SaConditions from '../SaConditions/SaConditions';
import SaReport from '../SaReport/SaReport';
// import PropertyDetails from "../../SA/Property/PropertyDetail";
import PropertyTab from './PropertyDetails';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import _colors from './../../../constants/colors';
import appApi from '../../../api/appApi';

const { width } = Dimensions.get('window');

const PropertyView = ({ property, navigation }) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [view, setView] = useState('');
	const [proptTrans, setProptTrans] = useState(null);

	// To get property transaction
	const getProptTrans = async () => {
		try {
			const token = await fetchAuthToken();
			const data = new FormData();
			return await appApi.get(
				`/get_property_transactions.php?property_transaction_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
		} catch (error) {}
	};

	React.useEffect(() => {
		getProptTrans().then((res) => setProptTrans(res.data.response.data));
	});

	// ;

	let rendered = <View />;

	if (view === 'property') {
		rendered = (
			<PropertyTab
				property={property}
				navigation={navigation}
				proptTrans={proptTrans}
			/>
		);
	}

	if (view === 'conditions') {
		rendered = <SaConditions property={property} />;
	}

	if (view === 'report') {
		rendered = <SaReport />;
	}

	const moveTo1 = () => {
		setCurrentStep(1);
	};

	const moveTo2 = () => {
		setCurrentStep(2);
	};

	const moveTo3 = () => {
		setCurrentStep(3);
	};

	return (
		<LogoPage title='' navigation={navigation}>
			<React.Fragment>
				<View style={styles.topWrapper}>
					<View style={styles.statusWrapper}>
						<Text style={styles.statusKey}>Status:</Text>
						<Text style={styles.statusValue}>
							{formatStatus(property.status)}
						</Text>
					</View>
					<View style={styles.statusWrapper}>
						<Text style={styles.statusKey}>Listing Date:</Text>
						<Text style={styles.date}>
							{moment(property.date_created).format('dddd d MMM, YYYY')}
						</Text>
					</View>
				</View>

				<View style={{}}>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('viewPropertyInfo', {
								property,
							});
							// setView("property");
						}}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Property</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('listingLawyer', { property });
							// setView("conditions");
						}}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Closing</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => {
							navigate('saConditions', {
								transaction: { property: 'plplplpl' },
								proptTrans: proptTrans[0],
							});
							// setView("conditions");
						}}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Condition</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() =>
							navigate('fileUpload', { transaction: proptTrans[0] })
						}
						style={styles.box}
					>
						<Text style={styles.boxTitle}>Files and Upload</Text>
						<AntDesign
							name='right'
							size={RFValue(15)}
							color={_colors.lightBrown}
						/>
					</TouchableOpacity>
				</View>

				{/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<Card style={styles.box}>
						<Image source={require('../../../assets/img/closing.png')} />
					</Card>
					<TouchableOpacity
						activeOpacity={0.9}
						onPress={() => setView('report')}
					>
						<Card style={styles.box}>
							<Image source={require('../../../assets/img/report.png')} />
							<View style={{ position: 'absolute', right: 10 }}>
								<AntDesign name='right' />
							</View>
						</Card>
					</TouchableOpacity>
				</View> */}
			</React.Fragment>

			{/* <PropertyDetails /> */}
			{rendered}
		</LogoPage>
	);
};

export default PropertyView;

const styles = StyleSheet.create({
	box: {
		width: width * 0.8,
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	boxText: {
		textAlign: 'center',
		color: colors.brown,
		fontSize: 24,
	},
	listTitle: {
		padding: 10,
		fontSize: 20,
		color: colors.lightGrey,
		textAlign: 'left',
	},
	listValue: {
		padding: 10,
		fontSize: 20,
		color: colors.white,
		textAlign: 'left',
	},
	box: {
		padding: RFValue(20),
		paddingVertical: RFValue(10),
		alignItems: 'center',
		backgroundColor: '#FFF',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: RFValue(20),
	},
	boxTitle: {
		..._font.Big,
		textAlign: 'center',
		color: colors.brown,
		fontSize: RFValue(18),
	},
	statusWrapper: { flexDirection: 'row' },
	statusKey: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		paddingRight: RFValue(10),
	},
	statusValue: {
		..._font.Medium,
		// fontSize: 20,
		color: colors.white,
		fontFamily: 'pop-semibold',
	},
	topWrapper: { marginBottom: RFValue(20) },
	date: { ..._font.Medium, color: colors.white },
});
