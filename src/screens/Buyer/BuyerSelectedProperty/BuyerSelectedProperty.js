import React, { useState } from 'react';
import LogoPage from '../../../components/LogoPage';
import * as RN from 'react-native';
import {
	Content,
	Footer,
	FooterTab,
	Button,
	Text,
	Container,
} from 'native-base';
import BuyerSelectedPropInfo from './Property/BuyerSelectedPropInfo';
import BuyerDealProgress from './DealProgress/BuyerDealProgress';
import BuyerNotif from './Notifs/BuyerNotif';
import colors from '../../../constants/colors';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const BuyerSelectedProperty = ({ navigation, route }) => {
	const [selected, setSelected] = useState('prop');

	const {
		property: { property, transaction, transaction_id },
	} = route.params;

	console.log('route...', route.params.property);

	let shown = <Content />;
	// let shown;
	if (selected === 'prop') {
		shown = (
			<BuyerSelectedPropInfo
				property={property}
				transaction={transaction}
				navigation={navigation}
			/>
		);
	}
	if (selected === 'deal') {
		shown = (
			<BuyerDealProgress
				property={property}
				transaction={transaction}
				navigation={navigation}
			/>
		);
	}

	if (selected === 'notif') {
		shown = (
			<BuyerNotif
				property={property}
				transaction={transaction}
				navigation={navigation}
			/>
		);
	}

	return (
		<Container style={styles.container}>
			<RN.StatusBar
				translucent={true}
				backgroundColor={'transparent'}
				barStyle={'light-content'}
			/>
			{shown}
			{/* <Footer>
				<FooterTab style={{ backgroundColor: colors.bgBrown }}>
					<Button
						active={selected === 'prop'}
						onPress={() => setSelected('prop')}
						style={{
							backgroundColor:
								selected === 'prop' ? colors.white : colors.bgBrown,
						}}
					>
						<Feather
							name='home'
							size={RFValue(20)}
							color={selected === 'prop' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								..._font.Medium,
								fontSize: RFValue(10),
								color: selected === 'prop' ? colors.bgBrown : colors.white,
							}}
						>
							Property
						</Text>
					</Button>
					<Button
						active={selected === 'deal'}
						onPress={() => setSelected('deal')}
						style={{
							backgroundColor:
								selected === 'deal' ? colors.white : colors.bgBrown,
						}}
					>
						<Feather
							name='trending-up'
							size={RFValue(20)}
							color={selected === 'deal' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								..._font.Medium,
								fontSize: RFValue(10),
								color: selected === 'deal' ? colors.bgBrown : colors.white,
							}}
						>
							Deal Progress
						</Text>
					</Button>
				</FooterTab>
			</Footer> */}
		</Container>
	);
};

export default BuyerSelectedProperty;

const styles = RN.StyleSheet.create({
	container: { paddingTop: RFValue(30), backgroundColor: colors.lightBrown },
});
