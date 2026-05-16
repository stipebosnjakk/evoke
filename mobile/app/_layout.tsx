import { Provider } from "react-redux";

import { store } from "@/store/store";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
};

export default RootLayout;
