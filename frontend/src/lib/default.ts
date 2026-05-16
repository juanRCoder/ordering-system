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
  observations: '',
  guest_name: '',
  total: 0,
};
