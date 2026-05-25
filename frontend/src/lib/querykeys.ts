export const baseKeys = {
  users: ['users'] as const,
  typesSupplies: ['types-supplies'] as const,
  supplies: ['supplies'] as const,
  orders: ['orders'] as const,
};

export const UsersKeys = {
  all: baseKeys.users,
  me: [...baseKeys.users, 'me'] as const,
};

export const TypesSuppliesKeys = {
  all: baseKeys.typesSupplies,
};

export const SuppliesKeys = {
  all: baseKeys.supplies,
  byTypeId: (type_id: string) =>
    [...baseKeys.supplies, 'type_id', type_id] as const,
};

export const OrdersKeys = {
  all: baseKeys.orders,
  byId: (id: string) => [...baseKeys.orders, 'id', id] as const,
};
