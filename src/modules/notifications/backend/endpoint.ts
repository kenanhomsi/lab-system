const endpoint = {
  deviceTokens: "/api/notifications/device-tokens",
  list: "/api/notifications",
  send: "/api/notifications/send",
  markRead: (id: number) => `/api/notifications/${id}/read`,
};

export { endpoint };
