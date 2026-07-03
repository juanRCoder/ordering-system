export const defaultLoginFormValues = {
  email: '',
  password: '',
};

export const defaultRegisterFormValues = {
  ...defaultLoginFormValues,
  name: '',
};

export const defaultNewOrder = {
  supplies: [],
  guest_name: '',
  total: 0,
  order_id: null,
};

export const supplyFormValues = {
  name: '',
  description: '',
  price: 1,
  imageUrl: null,
  imagePublicId: null,
};
