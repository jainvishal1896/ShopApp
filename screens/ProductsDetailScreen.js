import React from "react";
import {
	View,
	Text,
	Image,
	Button,
	StyleSheet,
	ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Color from "../constants/Color";
import * as cartActions from "../store/action/cart";

const ProductsDetailScreen = (props) => {
	const dispatch = useDispatch();
	const productId = props.navigation.getParam("productId");
	const selectedProduct = useSelector((state) =>
		state.products.availableProducts.find((item) => item.id === productId)
	);
	return (
		<ScrollView>
			<Image
				style={styles.image}
				source={{ uri: selectedProduct.imageUrl }}
			/>
			<View style={styles.action}>
				<Button
					color={Color.primary}
					title="Add to Cart"
					onPress={() => {
						dispatch(cartActions.addToCart(selectedProduct));
					}}
				/>
			</View>
			<Text style={styles.priceStyle}>
				${selectedProduct.price.toFixed(2)}
			</Text>
			<Text style={styles.descStyle}>{selectedProduct.description}</Text>
		</ScrollView>
	);
};

ProductsDetailScreen.navigationOptions = (navData) => {
	return {
		headerTitle: navData.navigation.getParam("productTitle"),
	};
};

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height: 300,
	},
	priceStyle: {
		fontSize: 20,
		color: "#888",
		textAlign: "center",
		marginVertical: 10,
		fontFamily: "open-sans-bold",
	},
	descStyle: {
		fontSize: 16,
		textAlign: "center",
		marginHorizontal: 20,
		fontFamily: "open-sans-reg",
	},
	action: {
		marginVertical: 10,
		alignItems: "center",
	},
});

export default ProductsDetailScreen;
