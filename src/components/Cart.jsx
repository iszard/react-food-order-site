import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import CartItem from "./CartItem";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

function Cart() {
  const cartContext = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  const cartTotal = cartContext.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCloseCart = () => {
    userProgressContext.hideCart();
  };

  const handleGoToCheckout = () => {
    userProgressContext.showCheckout();
  };

  return (
    <Modal
      className="cart"
      open={userProgressContext.progress === "cart"}
      onClose={userProgressContext.progress === "cart" ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartContext.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onDecrease={() => cartContext.removeItem(item.id)}
            onIncrease={() => cartContext.addItem(item)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>
          Close
        </Button>
        <Button
          disabled={cartContext.items.length === 0}
          onClick={handleGoToCheckout}
        >
          Go to Checkout
        </Button>
      </p>
    </Modal>
  );
}

export default Cart;
