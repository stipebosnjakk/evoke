import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import { LinearGradient } from "expo-linear-gradient";
import { easeGradient } from "react-native-easing-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { useRouter, useSegments } from "expo-router";

import { routes, TITLE_BY_ROUTE } from "@/constants/routes";
import {
  INBOX_SCOPE_ID,
  UPCOMING_SCOPE_ID,
  PROJECTS_SCOPE_ID,
  TODAY_SCOPE_ID,
} from "@/constants/scopeIds";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { ScopeScreenId } from "@/types/scope.types";
import { updateScreenViewAction } from "@/store/thunks/config.thunks";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const segments = useSegments();
  const activeRaw = segments[segments.length - 1];
  const active = activeRaw === "(tabs)" ? "index" : activeRaw;

  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;

  const { colors, locations } = easeGradient({
    colorStops: {
      0.55: { color: "white" },
      1: { color: "transparent" },
    },
  });

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

  const toggleView = () => {
    if (!view) return;
    const nextView = view === "group" ? "list" : "group";
    dispatch(updateScreenViewAction({ scopeId: scope, view: nextView }));
  };

  const navigateToCreateModal = () => {
    router.push(routes.create_task.href);
  };

  return (
    <>
      <View
        pointerEvents="none"
        style={[styles.blurContainer, { height: headerH + 40 }]}
      >
        <MaskedView
          style={[StyleSheet.absoluteFill]}
          maskElement={
            <LinearGradient
              locations={locations as any}
              colors={colors as any}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <LinearGradient
            colors={["white", "rgba(255, 255, 255,0.2)"]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView
            intensity={15}
            tint={"light"}
            style={[StyleSheet.absoluteFill]}
          />
        </MaskedView>
      </View>
      <View
        style={[
          styles.row,
          styles.container,
          { height: headerH, paddingTop: insets.top },
        ]}
      >
        <View style={styles.left}>
          <TouchableOpacity onPress={() => {}}>
            <SymbolView
              name="magnifyingglass"
              size={23}
              type="monochrome"
              tintColor="#111827"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.right}>
          <View style={styles.rightActions}>
            {view && (
              <TouchableOpacity onPress={toggleView}>
                <SymbolView
                  name={
                    view === "group"
                      ? "rectangle.stack.fill"
                      : "rectangle.grid.1x2.fill"
                  }
                  tintColor="black"
                  size={23}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={navigateToCreateModal}>
              <SymbolView
                name="plus"
                size={23}
                type="monochrome"
                tintColor="#111827"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  row: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
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
