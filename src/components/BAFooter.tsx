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
import PropertyDashboard from '../screens/BA/Property/PropertyDashboard';
import DealProgress from '../screens/BA/DealProgress/DealProgress';
import Notification from '../screens/BA/Notification/NotificationPage';
import Settings from '../screens/BA/Settings/Settings';
import LogoPage from './LogoPage';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../styles/fontStyles';

const { width } = Dimensions.get('window');

const BuyAgentFooter = ({
	active,
	property,
	transaction,
	isLoading,
	transactionStarted,
	fetchTransaction,
	navigation,
}) => {
	const [selected, setSelected] = useState('details');
	let shown = (
		<PropertyDashboard
			property={property}
			transaction={transaction}
			isLoading={isLoading}
			transactionStarted={transactionStarted}
			fetchTransaction={fetchTransaction}
			setSelected={setSelected}
			navigation={navigation}
		/>
	);

	if (selected === 'details') {
		shown = (
			<PropertyDashboard
				property={property}
				transaction={transaction}
				isLoading={isLoading}
				transactionStarted={transactionStarted}
				fetchTransaction={fetchTransaction}
				setSelected={setSelected}
				navigation={navigation}
			/>
		);
	}

	if (selected === 'progress') {
		shown = (
			<DealProgress
				navigation={navigation}
				transaction={transaction}
				isLoading={isLoading}
			/>
		);
	}

	if (selected === 'notif') {
		shown = (
			<Notification
				navigation={navigation}
				transaction={transaction}
				property={property}
			/>
		);
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
						active={selected === 'details'}
						onPress={() => setSelected('details')}
						vertical
					>
						<FontAwesome
							name='search'
							color={selected === 'details' ? colors.bgBrown : colors.white}
							size={RFValue(15)}
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
						style={{
							backgroundColor:
								selected === 'progress' ? colors.white : colors.bgBrown,
						}}
						onPress={() => setSelected('progress')}
						vertical
						active={selected === 'progress'}
					>
						{/* <Image
              source={require("../assets/img/progress.png")}
              style={{ width: 30, height: 30, backgroundColor: selected === "progress" ? colors.bgBrown : colors.white }}
            /> */}
						<Feather
							size={RFValue(15)}
							name='trending-up'
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
						style={{
							backgroundColor:
								selected === 'notif' ? colors.white : colors.bgBrown,
						}}
						onPress={() => setSelected('notif')}
						vertical
						active={selected === 'notif'}
					>
						<FontAwesome
							name='bell'
							color={selected === 'notif' ? colors.bgBrown : colors.white}
							size={RFValue(15)}
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

export default BuyAgentFooter;

const styles = StyleSheet.create({
	titles: {
		..._font.Medium,
		color: colors.white,
		fontSize: RFValue(10),
		paddingTop: RFValue(5),
	},
	btn: {},
});
