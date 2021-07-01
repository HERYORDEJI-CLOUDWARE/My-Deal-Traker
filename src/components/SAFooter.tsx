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
import colors from '../constants/colors';
import { Feather, FontAwesome } from '@expo/vector-icons';
import DealProgress from '../screens/BA/DealProgress/DealProgress';
// TODO File does not exist
// import Notification from "../screens/SA/Notification/SANotificationPage";
import Settings from '../screens/BA/Settings/Settings';
import PropertyView from '../screens/SA/Property/PropertyView';

const { width } = Dimensions.get('window');

const SellingAgentFooter = ({ property, navigation }) => {
	const [selected, setSelected] = useState('details');
	let shown = <PropertyView property={property} navigation={navigation} />;

	if (selected === 'details') {
		shown = <PropertyView property={property} navigation={navigation} />;
	}

	if (selected === 'progress') {
		shown = <DealProgress transaction={property} />;
	}

	if (selected === 'notif') {
		shown = <Notification transaction={property} />;
	}

	if (selected === 'setting') {
		shown = <Settings />;
	}

	return (
		<>
			{shown}
			<Footer style={{ backgroundColor: '#fff' }}>
				<FooterTab
					style={{
						backgroundColor: colors.bgBrown,
					}}
				>
					<Button
						style={{
							backgroundColor:
								selected === 'details' ? colors.white : colors.bgBrown,
						}}
						onPress={() => setSelected('details')}
						active={selected === 'details'}
					>
						<FontAwesome
							name='search'
							color={selected === 'details' ? colors.bgBrown : colors.white}
							size={25}
						/>
						<Text
							style={{
								...styles.titles,
								color: selected === 'details' ? colors.bgBrown : colors.white,
							}}
						>
							Listing
						</Text>
					</Button>
					<Button
						active={selected === 'progress'}
						style={{
							backgroundColor:
								selected === 'progress' ? colors.white : colors.bgBrown,
						}}
						onPress={() => setSelected('progress')}
					>
						<Feather
							name='trending-up'
							size={25}
							color={selected === 'progress' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								...styles.titles,
								color: selected === 'progress' ? colors.bgBrown : colors.white,
							}}
						>
							Deal Progress
						</Text>
					</Button>
					<Button
						active={selected === 'notif'}
						style={{
							backgroundColor:
								selected === 'notif' ? colors.white : colors.bgBrown,
						}}
						onPress={() => setSelected('notif')}
					>
						<FontAwesome
							name='bell'
							color={selected === 'notif' ? colors.bgBrown : colors.white}
							size={25}
						/>
						<Text
							style={{
								...styles.titles,
								color: selected === 'notif' ? colors.bgBrown : colors.white,
							}}
						>
							Notification
						</Text>
					</Button>
					{/* <TouchableOpacity
            style={styles.btn}
            onPress={() => setSelected("setting")}
          >
            <Feather name="settings" color={colors.white} size={25} />
            <Text style={styles.titles}>Settings</Text>
          </TouchableOpacity> */}
				</FooterTab>
			</Footer>
		</>
	);
};

export default SellingAgentFooter;

const styles = StyleSheet.create({
	titles: {
		fontSize: 11,
		color: colors.white,
	},
	btn: { justifyContent: 'center', alignItems: 'center', width: width / 4 },
});
