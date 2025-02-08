import { createContext, useState } from "react";

const UserProgressContext = createContext({
  progress: "", // 'cart', 'checkout'
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState();

  function showCartHandler() {
    setUserProgress("cart");
  }

  function hideCartHandler() {
    setUserProgress("");
  }

  function showCheckoutHandler() {
    setUserProgress("checkout");
  }

  function hideCheckoutHandler() {
    setUserProgress("");
  }

  const context = {
    progress: userProgress,
    showCart: showCartHandler,
    hideCart: hideCartHandler,
    showCheckout: showCheckoutHandler,
    hideCheckout: hideCheckoutHandler,
  };

  return (
    <UserProgressContext.Provider value={context}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
