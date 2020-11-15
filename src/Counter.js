import PropTypes from "prop-types";
import React from "react";

const Counter = ({
  count,
  showMessage,
  onIncrement,
  onDecrement,
  onIncrementAsync,
}) => (
  <div>
    <button onClick={onIncrementAsync}>Increment Async</button>
    <button onClick={onIncrement}>Increment</button>{" "}
    <button onClick={onDecrement}>Decrement</button>
    <hr />
    <div>Clicked: {count} times</div>
    {showMessage && <div>Congrats for incrementing 3 times</div>}
  </div>
);

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  showMessage: PropTypes.bool.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrementAsync: PropTypes.func.isRequired,
};

export default Counter;
