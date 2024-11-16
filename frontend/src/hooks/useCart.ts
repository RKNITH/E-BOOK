import { useContext } from "react";
import { CartContext } from "../context/CartProvider";

const useCart = () => useContext(CartContext);

export default useCart;
