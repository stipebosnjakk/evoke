import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter, useSegments } from "expo-router";

import { routes, TITLE_BY_ROUTE } from "@/constants/routes";
import {
  INBOX_SCOPE_ID,
  UPCOMING_SCOPE_ID,
  PROJECTS_SCOPE_ID,
  TODAY_SCOPE_ID,
  VIEW_OPTIONS,
} from "@/constants/scopeIds";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { ScopeScreenId } from "@/types/scope.types";
import { updateScreenViewAction } from "@/store/thunks/config.thunks";
import CustomButton from "@/components/ui/CustomButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const segments = useSegments();
  const activeRaw = segments[segments.length - 1];
  const active = activeRaw === "(tabs)" ? "index" : activeRaw;

  const config = useAppSelector((state) => state.user.config);

  const [title, setTitle] = useState<string | null>();

  useEffect(() => {
    setTitle((prev) => TITLE_BY_ROUTE[active] ?? prev);
  }, [active]);

  const getMainScopeByRoute = (route: string): ScopeScreenId | undefined => {
    if (route === "index") return TODAY_SCOPE_ID;
    if (route === "upcoming") return UPCOMING_SCOPE_ID;
    if (route === "inbox") return INBOX_SCOPE_ID;
    if (route === "projects") return PROJECTS_SCOPE_ID;
  };

  const activeMainScope = getMainScopeByRoute(active);

  const [scope, setScope] = useState<ScopeScreenId>(
    activeMainScope ?? TODAY_SCOPE_ID,
  );

  useEffect(() => {
    if (!activeMainScope) return;
    setScope(activeMainScope);
  }, [activeMainScope]);

  const view = config ? config.screens[scope].view : null;
  const viewOption = view ? VIEW_OPTIONS[view] : null;

  const toggleView = () => {
    if (!viewOption) return;

    dispatch(
      updateScreenViewAction({ scopeId: scope, view: viewOption.nextView }),
    );
  };

  const navigateToCreateModal = () => {
    router.push({
      pathname: routes.form_task.href,
      params: {
        mode: "create",
      },
    });
  };

  const navigateToSearch = () => {
    router.push(routes.search.href);
  };

  return (
    <HeaderWrapper>
      <View style={styles.left}>
        <CustomButton onPress={navigateToSearch}>
          <SymbolView
            name="magnifyingglass"
            size={23}
            type="monochrome"
            tintColor="#111827"
          />
        </CustomButton>
      </View>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.rightActions}>
          {viewOption && (
            <CustomButton onPress={toggleView}>
              <SymbolView
                name={viewOption.icon as any}
                tintColor="black"
                size={23}
              />
            </CustomButton>
          )}
          <CustomButton onPress={navigateToCreateModal}>
            <SymbolView
              name="plus"
              size={23}
              type="monochrome"
              tintColor="#111827"
            />
          </CustomButton>
        </View>
      </View>
    </HeaderWrapper>
  );
};

const styles = StyleSheet.create({
  left: {
    width: 72,
    alignItems: "flex-start",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    width: 72,
    alignItems: "flex-end",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default Header;
