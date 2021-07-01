import React, { useState } from 'react';
import LogoPage from '../../../components/LogoPage';
import { Content, Footer, FooterTab, Button, Text } from 'native-base';
import BuyerSelectedPropInfo from './Property/BuyerSelectedPropInfo';
import BuyerDealProgress from './DealProgress/BuyerDealProgress';
import BuyerNotif from './Notifs/BuyerNotif';
import colors from '../../../constants/colors';
import { Feather } from '@expo/vector-icons';

const BuyerSelectedProperty = ({ navigation, route }) => {
	const [selected, setSelected] = useState('prop');

	const {
		property: { property, transaction },
	} = route.params;

	// let shown = <Content />;
	let shown;
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
		<>
			{shown}
			<Footer>
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
							size={20}
							color={selected === 'prop' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
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
							size={20}
							color={selected === 'deal' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								color: selected === 'deal' ? colors.bgBrown : colors.white,
							}}
						>
							Deal Progress
						</Text>
					</Button>
					{/* <Button
              active={selected === "notif"}
              onPress={() => setSelected("notif")}
            >
              <Text>Notification</Text>
            </Button> */}
				</FooterTab>
			</Footer>
		</>
	);
};

export default BuyerSelectedProperty;
