import React from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Text,
	TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../constants/colors';
import { formatStatus } from '../utils/misc';

const { width } = Dimensions.get('window');

const PropertyListingCard = ({
	navigation,
	view,
	listNo,
	status,
	city,
	dad,
	item,
}) => {
	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate(view || 'viewListing', { property: item })
			}
			style={{ alignSelf: 'center' }}
			activeOpacity={0.9}
		>
			<Card containerStyle={styles.card}>
				<View style={styles.innerCircle} />
				<View style={styles.upperCircle} />
				<View style={{ overflow: 'hidden' }}>
					<Text style={{ color: colors.fairGrey, fontSize: 18 }}>
						<Text style={{ color: colors.fairGrey }}>Listing Number : </Text>
						<Text>{listNo}</Text>
					</Text>

					<Text
						style={{
							color: colors.fairGrey,
							paddingVertical: 10,
							fontSize: 18,
						}}
					>
						Status: {formatStatus(status)}
					</Text>

					<Text style={{ color: colors.fairGrey }}>
						<Text style={{ fontSize: 18 }}>City: </Text>
						<Text style={{ fontSize: 18 }}>{city}</Text>
					</Text>

					<Text style={{ color: colors.fairGrey, paddingVertical: 10 }}>
						<Text style={{ fontSize: 18 }}>Date Added: </Text>
						<Text style={{ fontSize: 18 }}>{dad}</Text>
					</Text>

					<Text
						style={{
							textAlign: 'right',
							color: colors.brown,
							borderBottomWidth: 0.5,
							alignSelf: 'flex-end',
						}}
					>
						See more details
					</Text>
				</View>
			</Card>
		</TouchableOpacity>
	);
};

export default PropertyListingCard;

const styles = StyleSheet.create({
	card: {
		width: width * 0.8,
		alignSelf: 'center',
		paddingVertical: 25,
		paddingHorizontal: 20,
		marginBottom: 27,
		borderRadius: 8.66,
		overflow: 'hidden',
	},
	innerCircle: {
		width: 70,
		height: 70,
		backgroundColor: colors.white,
		position: 'absolute',
		bottom: -50,
		left: -50,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: colors.brown,
		zIndex: -10000,
	},
	upperCircle: {
		width: 70,
		height: 70,
		backgroundColor: colors.white,
		position: 'absolute',
		top: -70,
		left: (width * 0.8) / 3,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: colors.brown,
		zIndex: -10000,
	},
});
