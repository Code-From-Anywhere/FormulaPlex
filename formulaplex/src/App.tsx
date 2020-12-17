import { Provider } from "react-redux";
import { store } from "./Context/Store";
import Container from "./Layout/Container";

const App = () => {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};
export default App;
