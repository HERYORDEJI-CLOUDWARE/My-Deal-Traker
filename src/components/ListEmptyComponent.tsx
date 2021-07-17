import { Text } from 'native-base';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import _font from '../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const ListEmptyComponent = ({ title, info, search }) => {
	return (
		<React.Fragment>
			{/* DISPLAY WHEN NO CONTENT FOUND */}
			<View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: 25,
					}}
				>
					<Image
						source={require('../assets/img/no_deals.png')}
						style={{ width: 261, height: 137, resizeMode: 'stretch' }}
					/>
				</View>

				{search ? (
					<View style={{ marginTop: 20 }}>
						<Text style={styles.noresult}>
							Sorry! No property match the search keyword.
						</Text>
						<Text style={styles.noresult}>Try again with another keyword</Text>
					</View>
				) : (
					<View style={{ marginTop: 20 }}>
						<Text style={styles.noresult}>
							{title || 'You have no recent activities.'}
						</Text>
						<Text style={styles.noresult}>
							{info || 'Search for property to start deal'}{' '}
						</Text>
					</View>
				)}
			</View>
		</React.Fragment>
	);
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
	noresult: {
		..._font.Small,
		textAlign: 'center',
		fontSize: RFValue(14),
		opacity: 0.9,
		color: colors.white,
	},
});
