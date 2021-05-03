export default (state, { type, payload }) => {
  switch (type) {
    case "JOINED":
      return {
        ...state,
        joined: payload,
        name: payload.name,
        room: payload.room,
      };
    case "SET_USERS":
      return {
        ...state,
        users: payload,
      };
    case "SET_DATA":
      return {
        ...state,
        users: payload.users,
        messages: payload.messages,
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, payload],
      };

    default:
      return state;
  }
};
