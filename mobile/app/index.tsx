import { Provider } from "react-redux";

import { store } from "@/store/store";
import TaskScreen from "@/components/TaskScreen";

const index = () => {
  return (
    <Provider store={store}>
      <TaskScreen />
    </Provider>
  );
};

export default index;
