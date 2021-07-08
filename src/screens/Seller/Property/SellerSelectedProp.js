import React, { useState } from 'react';
import {
	Container,
	Header,
	Content,
	Footer,
	FooterTab,
	Button,
	Text,
} from 'native-base';
import DealProgress from '../../BA/DealProgress/DealProgress';
import colors from '../../../constants/colors';
import { Feather } from '@expo/vector-icons';
import PropertyView from '../../SA/Property/PropertyView';
import SellerPropertyView from './PropertyInfo/SellerTransView';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../../styles/fontStyles';

const SellerSelectedProp = ({ route, navigation }) => {
	const { property } = route.params;

	const [selected, setSelected] = useState('trans');

	let Shown = <Content />;
	if (selected === 'progress') {
		Shown = <DealProgress transaction={property} />;
	}

	if (selected === 'trans') {
		Shown = <SellerPropertyView property={property} navigation={navigation} />;
	}

	return (
		<React.Fragment>
			<Content>{Shown}</Content>
			<Footer>
				<FooterTab>
					<Button
						onPress={() => setSelected('trans')}
						style={{
							backgroundColor:
								selected === 'trans' ? colors.white : colors.bgBrown,
						}}
					>
						<Feather
							name='home'
							size={RFValue(20)}
							color={selected === 'trans' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								..._font.Medium,
								fontSize: RFValue(12),
								color: selected === 'trans' ? colors.bgBrown : colors.white,
							}}
						>
							Transaction
						</Text>
					</Button>
					<Button
						onPress={() => setSelected('progress')}
						style={{
							backgroundColor:
								selected === 'progress' ? colors.white : colors.bgBrown,
						}}
					>
						<Feather
							name='trending-up'
							size={RFValue(20)}
							color={selected === 'progress' ? colors.bgBrown : colors.white}
						/>
						<Text
							style={{
								..._font.Medium,
								fontSize: RFValue(12),
								color: selected === 'progress' ? colors.bgBrown : colors.white,
							}}
						>
							Deal Progress
						</Text>
					</Button>
				</FooterTab>
			</Footer>
		</React.Fragment>
	);
};

export default SellerSelectedProp;
