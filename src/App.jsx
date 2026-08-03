import PropTypes from "prop-types";

function App({ prop }) {
  return <div>{prop}</div>;
}
App.propTypes = {
  prop: PropTypes.string.isRequired,
};
export default App;
