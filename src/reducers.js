export default function counter(
  state = { count: 0, showCongrats: false },
  action
) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1,
      };
    case "SHOW_CONGRATS":
      return {
        ...state,
        showCongrats: true,
      };
    default:
      return state;
  }
}
