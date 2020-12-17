import { Provider } from "react-redux";
import Container from "./Layout/Container";
import { store } from "./Store";

const App = () => {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};
export default App;
