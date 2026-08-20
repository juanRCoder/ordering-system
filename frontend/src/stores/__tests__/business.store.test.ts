import { describe, it, expect, beforeEach } from 'vitest';
import { useBusinessStore } from '../business.store';

describe('useBusinessStore', () => {
  beforeEach(() => {
    useBusinessStore.getState().clearBusiness();
    localStorage.clear();
  });

  describe('initial state', () => {
    it('tiene el estado inicial correcto', () => {
      const state = useBusinessStore.getState();
      expect(state.business_name).toBeNull();
      expect(state.slug).toBeNull();
      expect(state.owner_name).toBeNull();
      expect(state.is_business_open).toBeNull();
      expect(state.phone).toBeNull();
      expect(state.table_count).toBeNull();
      expect(state.order_id).toBeNull();
      expect(state.guest_name).toBeNull();
    });
  });

  describe('setBusiness', () => {
    it('establece los datos del negocio correctamente', () => {
      useBusinessStore.getState().setBusiness({
        business_name: 'Mi Negocio',
        slug: 'mi-negocio',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '123456789',
      });

      const state = useBusinessStore.getState();
      expect(state.business_name).toBe('Mi Negocio');
      expect(state.slug).toBe('mi-negocio');
      expect(state.owner_name).toBe('Juan');
      expect(state.is_business_open).toBe(true);
      expect(state.phone).toBe('123456789');
    });

    it('actualiza datos existentes', () => {
      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio 1',
        slug: 'negocio-1',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '111111111',
      });

      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio 2',
        slug: 'negocio-2',
        owner_name: 'Pedro',
        is_business_open: false,
        phone: '222222222',
      });

      const state = useBusinessStore.getState();
      expect(state.business_name).toBe('Negocio 2');
      expect(state.slug).toBe('negocio-2');
      expect(state.owner_name).toBe('Pedro');
      expect(state.is_business_open).toBe(false);
      expect(state.phone).toBe('222222222');
    });

    it('no modifica order_id ni guest_name', () => {
      useBusinessStore.getState().setOrder({
        order_id: 'order-1',
        guest_name: 'Invitado',
      });

      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio',
        slug: 'negocio',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '123456789',
      });

      const state = useBusinessStore.getState();
      expect(state.order_id).toBe('order-1');
      expect(state.guest_name).toBe('Invitado');
    });
  });

  describe('setOrder', () => {
    it('establece order_id y guest_name correctamente', () => {
      useBusinessStore.getState().setOrder({
        order_id: 'order-123',
        guest_name: 'Cliente 1',
      });

      const state = useBusinessStore.getState();
      expect(state.order_id).toBe('order-123');
      expect(state.guest_name).toBe('Cliente 1');
    });

    it('actualiza order existente', () => {
      useBusinessStore.getState().setOrder({
        order_id: 'order-1',
        guest_name: 'Cliente 1',
      });

      useBusinessStore.getState().setOrder({
        order_id: 'order-2',
        guest_name: 'Cliente 2',
      });

      const state = useBusinessStore.getState();
      expect(state.order_id).toBe('order-2');
      expect(state.guest_name).toBe('Cliente 2');
    });

    it('no modifica datos del negocio', () => {
      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio',
        slug: 'negocio',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '123456789',
      });

      useBusinessStore.getState().setOrder({
        order_id: 'order-1',
        guest_name: 'Cliente',
      });

      const state = useBusinessStore.getState();
      expect(state.business_name).toBe('Negocio');
      expect(state.slug).toBe('negocio');
    });
  });

  describe('setTableCount', () => {
    it('establece el conteo de mesas correctamente', () => {
      useBusinessStore.getState().setTableCount(10);

      const state = useBusinessStore.getState();
      expect(state.table_count).toBe(10);
    });

    it('actualiza el conteo de mesas', () => {
      useBusinessStore.getState().setTableCount(5);
      useBusinessStore.getState().setTableCount(15);

      const state = useBusinessStore.getState();
      expect(state.table_count).toBe(15);
    });
  });

  describe('clearBusiness', () => {
    it('restablece todo al estado inicial', () => {
      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio',
        slug: 'negocio',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '123456789',
      });
      useBusinessStore.getState().setOrder({
        order_id: 'order-1',
        guest_name: 'Cliente',
      });
      useBusinessStore.getState().setTableCount(10);

      useBusinessStore.getState().clearBusiness();

      const state = useBusinessStore.getState();
      expect(state.business_name).toBeNull();
      expect(state.slug).toBeNull();
      expect(state.owner_name).toBeNull();
      expect(state.is_business_open).toBeNull();
      expect(state.phone).toBeNull();
      expect(state.table_count).toBeNull();
      expect(state.order_id).toBeNull();
      expect(state.guest_name).toBeNull();
    });
  });

  describe('persistencia', () => {
    it('persiste los datos en localStorage', () => {
      useBusinessStore.getState().setBusiness({
        business_name: 'Negocio Persistente',
        slug: 'negocio-persistente',
        owner_name: 'Juan',
        is_business_open: true,
        phone: '123456789',
      });

      const stored = localStorage.getItem('business-storage');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.business_name).toBe('Negocio Persistente');
      expect(parsed.state.slug).toBe('negocio-persistente');
    });
  });
});
