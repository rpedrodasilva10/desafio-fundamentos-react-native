import AsyncStorage from '@react-native-community/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      console.log('Loading');
      // await AsyncStorage.removeItem('@GoMarketPlace:cartProducts');
      const cartProducts = await AsyncStorage.getItem(
        '@GoMarketPlace:cartProducts',
      );

      if (cartProducts) {
        setCartProducts([...JSON.parse(cartProducts)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (newProduct: Product) => {
      const hasFound = cartProducts.find(
        product => newProduct.id == product.id,
      );

      if (hasFound) {
        setCartProducts(
          cartProducts.map(product =>
            product.id == newProduct.id
              ? {
                  ...newProduct,
                  quantity: product.quantity + 1,
                }
              : product,
          ),
        );
      } else {
        setCartProducts([...cartProducts, { ...newProduct, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cartProducts',
        JSON.stringify(cartProducts),
      );
    },
    [cartProducts],
  );

  const increment = useCallback(
    async id => {
      setCartProducts(
        cartProducts.map(product =>
          product.id == id
            ? {
                ...product,
                quantity: product.quantity + 1,
              }
            : product,
        ),
      );

      await AsyncStorage.setItem(
        '@GoMarketPlace:cartProducts',
        JSON.stringify(cartProducts),
      );
    },
    [cartProducts],
  );

  const decrement = useCallback(
    async id => {
      setCartProducts(
        cartProducts.map(product =>
          product.id == id
            ? {
                ...product,
                quantity: product.quantity - 1,
              }
            : product,
        ),
      );

      await AsyncStorage.setItem(
        '@GoMarketPlace:cartProducts',
        JSON.stringify(cartProducts),
      );
    },
    [cartProducts],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products: cartProducts }),
    [cartProducts, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
