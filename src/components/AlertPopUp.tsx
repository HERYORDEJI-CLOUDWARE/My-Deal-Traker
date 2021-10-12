import * as React from "react";
import * as RN from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import _font from "../styles/fontStyles";
import _colors from "../constants/colors";

interface Props {
  body?: string;
  title?: string;
  header?: string;
  okayText?: string;
  visible?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const AlertPopUp = (props: Props) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const onCloseModal = () => setIsVisible(!isVisible);

  return (
    <RN.Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={props.visible ?? isVisible}
      style={styles.container}
      presentationStyle={"pageSheet"}
      onRequestClose={props.onCancel ?? onCloseModal}
    >
      <RN.View style={styles.content}>
        <RN.View style={styles.wrapper}>
          <RN.Text style={styles.title}>{props.title}</RN.Text>
          {props.header && (
            <RN.Text style={styles.header}>{props.header}</RN.Text>
          )}
          <RN.Text style={styles.body}>{props.body}</RN.Text>

          <RN.View style={styles.bottomWrapper}>
            <RN.Pressable
              onPress={props.onCancel ?? onCloseModal}
              style={styles.cancelButton}
            >
              <RN.Text style={styles.cancelText}>
                {props.cancelText ?? "Cancel"}
              </RN.Text>
            </RN.Pressable>
            <RN.Pressable
              onPress={props.onCancel ?? onCloseModal}
              style={styles.okayButton}
            >
              <RN.Text style={styles.okayText}>
                {props.okayText ?? "Okay"}
              </RN.Text>
            </RN.Pressable>
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.Modal>
  );
};

const styles = RN.StyleSheet.create({
  container: {},
  content: {
    flex: 1,
    backgroundColor: "#00000050",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  wrapper: { backgroundColor: "#FFFFFF", width: "100%", padding: RFValue(20) },
  title: {
    ..._font.Small,
    color: _colors.brown,
    fontSize: RFValue(13),
    textAlign: "center",
    letterSpacing: RFValue(2),
  },
  header: {
    ..._font.Medium,
    color: _colors.brown,
    letterSpacing: RFValue(1),
    marginBottom: RFValue(5),
  },
  body: {
    ..._font.Medium,
    color: _colors.brown,
    letterSpacing: RFValue(1),
    marginBottom: RFValue(5),
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: { paddingVertical: RFValue(10) },
  okayButton: { paddingVertical: RFValue(10) },
  cancelText: { ..._font.Small, fontSize: RFValue(14), color: _colors.fair },
  okayText: {
    ..._font.Small,
    fontSize: RFValue(14),
    color: _colors.lightBrown,
  },
});

export const alertPopUp = (
  body,
  title,
  header,
  okayText,
  visible,
  cancelText,
  onCancel,
  onConfirm
) => (
  <AlertPopUp
    body={body}
    title={title}
    header={header}
    okayText={okayText}
    visible={visible}
    cancelText={cancelText}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);
