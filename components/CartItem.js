import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android" || Platform.Version >= 21) {
	TouchableCmp = TouchableNativeFeedback;
}
const CartItem = (props) => {
	return (
		<View style={styles.cartItem}>
			<View style={styles.itemData}>
				<Text style={styles.quantity}>{props.quantity} </Text>
				<Text style={styles.mainText}>{props.title}</Text>
			</View>
			<View style={styles.itemContainer}>
				<View style={styles.textContainer}>
					<Text style={styles.mainText}>$ {props.amount.toFixed(2)}</Text>
				</View>
				{props.deletable && (
					<View style={styles.deleteButton}>
						<TouchableCmp onPress={props.onRemove}>
							<Ionicons
								name={
									Platform.OS === "android" ? "md-trash" : "ios-trash"
								}
								size={26}
								color="red"
							/>
						</TouchableCmp>
					</View>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	cartItem: {
		padding: 10,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 10,
		width: "100%",
	},
	itemData: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
		width: "50%",
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		width: "50%",
	},
	quantity: {
		fontFamily: "open-sans-bold",
		color: "#888",
		fontSize: 20,
	},
	mainText: {
		fontFamily: "open-sans-bold",
		padding: 10,
		fontSize: 18,
	},
	textContainer: {
		width: "70%",
	},
	deleteButton: {},
});

export default CartItem;
