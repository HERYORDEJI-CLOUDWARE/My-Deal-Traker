import React, { Component } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import * as RN from 'react-native';
import PropTypes from 'prop-types';
import { RFValue } from 'react-native-responsive-fontsize';

// Components
import scorePassword from './utils/score-password';
import calculateAbsoluteWidth from './utils/calculate-absolute-width';
import calculateLevel from './utils/calculate-level';

// Style
import style from './utils/style';
import { BAR_PASSWORD_STRENGTH_DISPLAY } from './utils/constants';

interface Props {
	password: string;
	touched: boolean;
	scoreLimit: string;
	variations: string;
	minLength: number;
	labelVisible: boolean;
	levels: number;
	wrapperStyle: RN.ViewStyle;
	barContainerStyle: RN.ViewStyle;
	barStyle: RN.ViewStyle;
	labelStyle: RN.TextStyle;
	barColor: string;
	width: number;
}

type BarProps = { age: number } & typeof BAR_PASSWORD_STRENGTH_DISPLAY;

class BarPasswordStrengthDisplay extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
		this.animatedBarWidth = new Animated.Value(0);
	}

	render() {
		const {
			password,
			touched,
			scoreLimit,
			variations,
			minLength,
			labelVisible,
			levels,
			wrapperStyle,
			barContainerStyle,
			barStyle,
			labelStyle,
			barColor,
			width,
		} = this.props;
		const score = scorePassword(password, minLength, scoreLimit, variations);
		const absoluteWidth = calculateAbsoluteWidth(score, width);
		const { label, labelColor, activeBarColor } = calculateLevel(score, levels);

		Animated.timing(this.animatedBarWidth, {
			toValue: absoluteWidth,
			duration: 700,
			useNativeDriver: false,
		}).start();
		return (
			<View style={[style.wrapper, wrapperStyle, { ...stylesd.wrapper }]}>
				<View
					style={[
						style.barContainer,
						barContainerStyle,
						{ backgroundColor: barColor, width: width * 0.2 },
					]}
				>
					<Animated.View
						style={[
							style.bar,
							barStyle,
							{ width: this.animatedBarWidth, backgroundColor: activeBarColor },
						]}
					/>
				</View>
				{labelVisible && (touched || score !== 0) ? (
					<Text style={[stylesd.label, labelStyle, { color: labelColor }]}>
						{label}
					</Text>
				) : null}
			</View>
		);
	}
}

BarPasswordStrengthDisplay.defaultProps = BAR_PASSWORD_STRENGTH_DISPLAY;

BarPasswordStrengthDisplay.propTypes = {
	password: PropTypes.string.isRequired,
	touched: PropTypes.bool,
	scoreLimit: PropTypes.number,
	variations: PropTypes.object,
	minLength: PropTypes.number,
	labelVisible: PropTypes.bool,
	levels: PropTypes.array,
	wrapperStyle: PropTypes.object,
	barContainerStyle: PropTypes.object,
	barStyle: PropTypes.object,
	labelStyle: PropTypes.object,
	barColor: PropTypes.string,
	width: PropTypes.number,
};

export default BarPasswordStrengthDisplay;

const stylesd = StyleSheet.create({
	wrapper: { justifyContent: 'space-between', flex: 1 },
	bar: { flex: 0.7 },
	label: { fontSize: RFValue(12), alignSelf: 'flex-end', textAlign: 'right' },
});
