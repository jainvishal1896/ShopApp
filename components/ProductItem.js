import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
} from "react-native";
import Card from "./UI/Card";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android" || Platform.Version <= 21) {
	TouchableCmp = TouchableNativeFeedback;
}

const ProductItem = (props) => {
	return (
		<Card style={styles.product}>
			<View style={styles.touchable}>
				<TouchableCmp onPress={props.onSelect} useForeground>
					<View>
						<View style={styles.imageContainer}>
							<Image
								style={styles.image}
								source={{ uri: props.image }}
							/>
						</View>
						<View style={styles.details}>
							<Text style={styles.title}>{props.title}</Text>
							<Text style={styles.price}>${props.price.toFixed(2)}</Text>
						</View>
						<View style={styles.action}>{props.children}</View>
					</View>
				</TouchableCmp>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	touchable: {
		borderRadius: 10,
		overflow: "hidden",
	},
	imageContainer: {
		width: "100%",
		height: "60%",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	details: {
		alignItems: "center",
		height: "20%",
		paddingVertical: 5,
	},
	product: {
		height: 300, // you can use Dimensions API
		margin: 20,
	},
	title: {
		fontFamily: "open-sans-bold",
		fontSize: 18,
		marginVertical: 4,
	},
	price: { fontFamily: "open-sans-reg", fontSize: 14, color: "#888" },
	action: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: "20%",
		paddingHorizontal: 20,
	},
});

export default ProductItem;
