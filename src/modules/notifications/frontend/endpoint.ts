const endpoint = {
  deviceTokens: "/notifications/device-tokens",
  list: "/notifications",
  send: "/notifications/send",
  markRead: (id: number) => `/notifications/${id}/read`,
};

export { endpoint };
