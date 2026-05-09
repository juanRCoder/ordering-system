export const baseKeys = {
  users: ['users'] as const,
};

export const UsersKeys = {
  all: baseKeys.users,
  me: [...baseKeys.users, 'me'] as const,
};
