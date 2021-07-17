import React, { Component, useState } from 'react';
import {
	Container,
	Header,
	Content,
	Footer,
	FooterTab,
	Button,
	Text,
} from 'native-base';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
// import DealProgress from "../screens/BA/DealProgress/DealProgress";
// import Notification from "../screens/SA/Notification/Notification.jsx";
// import Settings from "../screens/BA/Settings/Settings";
// import PropertyView from "../screens/SA/Property/PropertyView.jsx";
import colors from '../../../../constants/colors';
import SLPropertyView from '../SLPropertyView';
import SLDealProgress from '../../Progress/SLDealProgress';
import LogoPage from '../../../../components/LogoPage';

const { width } = Dimensions.get('window');

const SLFooterTabs = ({ navigation, property }) => {
	const [selected, setSelected] = useState('detail');
	let shown = <View />;

	if (selected === 'detail') {
		shown = <SLPropertyView navigation={navigation} property={property} />;
	}

	if (selected === 'progress') {
		shown = <SLDealProgress />;
	}

	if (selected === 'notif') {
		shown = <View style={{ flex: 1 }} />;
	}

	if (selected === 'setting') {
		shown = <View />;
	}

	return (
		<LogoPage>
			<>{shown}</>
			{/* <Footer style={{ backgroundColor: '#fff' }}>
				<FooterTab
					style={{
						backgroundColor: colors.bgBrown,
						borderWidth: 0.5,
						borderColor: colors.white,
						elevation: 1,
					}}
				>
					<TouchableOpacity
						style={styles.btn}
						onPress={() => setSelected('detail')}
					>
						<FontAwesome name='search' color={colors.white} size={25} />
						<Text style={styles.titles}>Listing</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.btn}
						onPress={() => setSelected('progress')}
					>
						<Image
							source={require('../../../../assets/img/progress.png')}
							style={{ width: 30, height: 30 }}
						/>
						<Text style={styles.titles}>Deal Progress</Text>
					</TouchableOpacity>
				</FooterTab>
			</Footer> */}
		</LogoPage>
	);
};

export default SLFooterTabs;

const styles = StyleSheet.create({
	titles: {
		fontSize: 11,
		color: colors.white,
		textAlign: 'center',
	},
	btn: {
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 2,
		alignSelf: 'center',
		borderWidth: 0,
	},
});
