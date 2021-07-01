// module.exports = {
//   transformer: {
//     assetPlugins: ['expo-asset/tools/hashAssetFiles'],
//   },
//   resolver: {
//     /* resolver options */
//     sourceExts: ["jsx", "js", "tsx", "ts"], //add here
//   },
//   transformer: {
//     /* transformer options */
//   },
//   serializer: {
//     /* serializer options */
//   },
//   server: {
//     /* server options */
//   },
// };

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
	const {
		resolver: { sourceExts, assetExts },
	} = await getDefaultConfig();
	return {
		transformer: {
			assetPlugins: ['expo-asset/tools/hashAssetFiles'],
			babelTransformerPath: require.resolve('react-native-svg-transformer'),
		},
		resolver: {
			assetExts: assetExts.filter((ext) => ext !== 'svg'),
			sourceExts: [...sourceExts, 'svg'],
		},
	};
})();
