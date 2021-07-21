import * as React from 'react';
import * as RN from 'react-native';
import colors from '../../constants/colors';
import {
	ActivityIndicator,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as NB from 'native-base';
import _font from '../../styles/fontStyles';
import { WebView } from 'react-native-webview';

interface Props {
	uri: string;
	showFileViewer: (e: boolean) => void;
}

export default function FileViewer(props: Props) {
	const [showGateway, setShowGateway] = React.useState(false);
	const [prog, setProg] = React.useState(false);
	const [progClr, setProgClr] = React.useState('#000');

	const webviewRef = React.useRef(null);

	function webViewgoback() {
		if (webviewRef.current) webviewRef.current.goBack();
	}

	function webViewNext() {
		if (webviewRef.current) webviewRef.current.goForward();
	}

	function LoadingIndicatorView() {
		return (
			<ActivityIndicator
				color='#009b88'
				size='large'
				style={styles.ActivityIndicatorStyle}
			/>
		);
	}

	return (
		<View style={styles.webViewCon}>
			<View style={styles.wbHead}>
				<TouchableOpacity
					style={{ padding: RFValue(13) }}
					onPress={() => props.showFileViewer(false)}
				>
					<NB.Icon
						type='Feather'
						name={'x'}
						style={{ color: colors.white, fontSize: RFValue(20) }}
					/>
				</TouchableOpacity>
				<Text
					style={{
						..._font.Medium,
						color: colors.white,
						flex: 1,
						textAlign: 'center',
					}}
				>
					View File
				</Text>
				<View style={{ padding: 13 }}>
					<NB.Icon
						type='Feather'
						name={'rotate-cw'}
						style={{ color: colors.white, fontSize: RFValue(20) }}
					/>
				</View>
			</View>
			{props.uri ? (
				<WebView
					source={{ uri: `${props.uri}` }}
					style={{ flex: 1 }}
					renderLoading={LoadingIndicatorView}
					startInLoadingState={true}
					ref={webviewRef}
					// injectedJavaScript={initialHtmlInject()}
					onLoadStart={() => {
						setProg(true);
						setProgClr('#000');
					}}
					onLoadProgress={() => {
						setProg(true);
						setProgClr('#00457C');
					}}
					onLoadEnd={() => {
						setProg(false);
					}}
					onLoad={() => {
						setProg(false);
					}}
					// onMessage={onMessage}
				/>
			) : (
				{ LoadingIndicatorView }
			)}
		</View>
	);
}

const styles = RN.StyleSheet.create({
	webViewCon: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		// padding: RFValue(10),
		// paddingHorizontal: RFValue(30),
		// paddingBottom: RFValue(30),
	},
	wbHead: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.lightBrown,
		zIndex: 25,
		paddingTop: RFValue(20),
	},
	fileValidModalText: { ..._font.Medium, color: colors.brown },
	ActivityIndicatorStyle: {
		flex: 1,
		justifyContent: 'center',
	},
});

const file_ = {
	allowed_roles: ['1', '6', '7'],
	category_id: '10',
	category_name: 'Letter of Direction',
	comment: '',
	date_created: '2021-05-19 16:54:05',
	document_name: 'Cloudware',
	image_url:
		'https://mydealtracker.staging.cloudware.ng/uploads/16214396451afric.pdf',
	transaction_id: 'undefined',
	unique_id: '98efa7257dd231197d230f4a05bbe487',
	user_fullname: 'Marvelous',
	user_id: '5e6af0d9ac5ad1bda82049aa4bc60760',
};
