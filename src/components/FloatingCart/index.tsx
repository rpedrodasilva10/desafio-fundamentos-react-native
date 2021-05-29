import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useCart } from '../../hooks/cart';
import formatValue from '../../utils/formatValue';
import {
  CartButton,
  CartButtonText,
  CartPricing,
  CartTotalPrice,
  Container,
} from './styles';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    let totalCartValue = 0;

    products.map(
      product => (totalCartValue += product.quantity * product.price),
    );

    return formatValue(totalCartValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    let totalCartItensCount = 0;

    products.map(product => (totalCartItensCount += product.quantity));

    return totalCartItensCount;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
