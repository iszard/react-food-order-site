import { useActionState, useContext } from "react";
import useHttp from "../hooks/useHttp";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import Input from "./UI/Input";
import Modal from "./UI/Modal";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

function Checkout() {
  const cartContext = useContext(CartContext);
  const userProgressContext = useContext(UserProgressContext);

  const {
    data,
    // isLoading: isSending,  // only used if the using the form elements onSubmit property
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartContext.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCloseCheckout = () => {
    userProgressContext.hideCart();
  };

  const handleFinish = () => {
    userProgressContext.hideCart();
    cartContext.clearCart();
    clearData();
  };

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  //=========================================================
  // using the form elements onSubmit property
  /*
  const handleSubmitOrder = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());

    sendRequest(
      JSON.stringify({
        order: {
          customer: customerData,
          items: cartContext.items,
        },
      })
    );
  };
  */
  //=========================================================

  //=========================================================
  // using the form elements action property
  const checkoutAction = async (prevStatem, formData) => {
    const customerData = Object.fromEntries(formData.entries());

    await sendRequest(
      JSON.stringify({
        order: {
          customer: customerData,
          items: cartContext.items,
        },
      })
    );
  };

  // useActionState is used for potential form validation
  const [formState, formAction, isSending] = useActionState(
    checkoutAction,
    null
  );

  //=========================================================

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressContext.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order has been submitted successfully!</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      open={userProgressContext.progress === "checkout"}
      onClose={handleCloseCheckout}
    >
      {/* <form onSubmit={handleSubmitOrder}> */}
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

export default Checkout;
