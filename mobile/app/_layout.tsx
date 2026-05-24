import { Provider } from "react-redux";
import { PortalHost } from "@rn-primitives/portal";

import "@/global.css";
import { store } from "@/store/store";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <RootLayoutContent />
      <PortalHost />
    </Provider>
  );
};

export default RootLayout;
