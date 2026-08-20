import type { SupplyResponse } from '@/interfaces/supplies.interface';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateTotals,
  useCartStore,
  type CartItemType,
} from '../cart.store';

const mockSupply: SupplyResponse = {
  id: 'supply-1',
  name: 'Supply 1',
  price: 10,
  image_url: 'https://example.com/supply1.jpg',
};

describe('calculateTotals', () => {
  it('calcula el precio total y cantidad total de insumos', () => {
    const items: CartItemType[] = [
      { ...mockSupply, quantity: 2 },
      { id: 'supply-2', name: 'Supply 2', price: 20, quantity: 1 },
    ];
    const totals = calculateTotals(items);

    expect(totals.totalSupplies).toBe(3);
    expect(totals.totalPrice).toBe(40);
  });

  it('devuelve ceros para un array vacío', () => {
    const totals = calculateTotals([]);

    expect(totals.totalSupplies).toBe(0);
    expect(totals.totalPrice).toBe(0);
  });
});

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  const items: CartItemType[] = [
    { ...mockSupply, id: 'supply-2', name: 'Supply 2', price: 20, quantity: 1 },
    { ...mockSupply, id: 'supply-3', name: 'Supply 3', price: 30, quantity: 1 },
    { ...mockSupply, id: 'supply-4', name: 'Supply 4', price: 40, quantity: 2 },
  ];

  describe('addItem', () => {
    it('agrega un nuevo supply con cantidad 1', () => {
      useCartStore.getState().addItem(items[0]);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(items[0]);
      expect(state.totalSupplies).toBe(1);
      expect(state.totalPrice).toBe(20);
    });

    it('agrega varios supplies diferentes', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().addItem(items[1]);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].name).toBe('Supply 2');
      expect(state.items[1].name).toBe('Supply 3');
      expect(state.totalSupplies).toBe(2);
      expect(state.totalPrice).toBe(50);
    });
  });

  describe('removeItem', () => {
    it('elimina el elemento existente', () => {
      useCartStore.getState().addItem(mockSupply);
      useCartStore.getState().removeItem('supply-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.totalSupplies).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('no hace nada si el elemento no existe', () => {
      useCartStore.getState().addItem(mockSupply);
      useCartStore.getState().removeItem('non-existent-id');

      const state = useCartStore.getState();
      expect(state.totalSupplies).toBe(1);
      expect(state.totalPrice).toBe(10);
    });

    it('actualiza correctamente el total después de eliminar un elemento', () => {
      useCartStore.getState().addItem(mockSupply);
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().removeItem('supply-1');

      const state = useCartStore.getState();
      expect(state.totalPrice).toBe(20);
    });
  });

  describe('incrementQuantity', () => {
    it('incrementa la cantidad en 1', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().incrementQuantity('supply-2');

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2);
      expect(state.totalSupplies).toBe(2);
      expect(state.totalPrice).toBe(40);
    });

    it('No hace nada por un elemento inexistente', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().incrementQuantity('supply-999');

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalSupplies).toBe(1);
      expect(state.totalPrice).toBe(20);
    });
  });

  describe('decrementQuantity', () => {
    it('decrementa la cantidad en 1', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().addItem(items[1]);
      useCartStore.getState().decrementQuantity('supply-3');

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalSupplies).toBe(1);
      expect(state.totalPrice).toBe(20);
    });

    it('No hace nada por un elemento inexistente', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().decrementQuantity('supply-999');

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(1);
      expect(state.totalSupplies).toBe(1);
      expect(state.totalPrice).toBe(20);
    });
  });

  describe('clear', () => {
    it('restablece el carrito al estado inicial', () => {
      useCartStore.getState().addItem(items[0]);
      useCartStore.getState().addItem(items[1]);
      useCartStore.getState().clear();

      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.totalSupplies).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});
