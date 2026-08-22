import { useEffect } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import Task from "@/components/task/Task";
import Project from "@/components/projects/Project";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectGroupById } from "@/store/selectors/task.selector";
import { GroupTasks, ScopeScreenId } from "@/types/scope.types";
import { PROJECTS_SCOPE_ID } from "@/constants/scopeIds";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import CustomButton from "@/components/custom/CustomButton";
import { SymbolView } from "expo-symbols";
import { routes } from "@/constants/routes";

type LocalSearchParamsType = {
  groupId: GroupTasks;
  scopeId: ScopeScreenId;
};

const GroupScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const { groupId, scopeId } = useLocalSearchParams<LocalSearchParamsType>();

  const { title, data } = useAppSelector((state) =>
    selectGroupById(state, groupId),
  );

  useEffect(() => {
    if (data.length === 0) router.back();
  }, [data, router]);

  const renderItem = ({ item }: { item: any }) => {
    return scopeId === PROJECTS_SCOPE_ID ? (
      <Project project={item} />
    ) : (
      <Task task={item} />
    );
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(routes.today.href);
    }
  };

  return (
    <SheetWrapper>
      <HeaderWrapper>
        <View style={styles.side}>
          <CustomButton onPress={handleGoBack}>
            <SymbolView
              name="chevron.left"
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
        <View style={styles.sidePlaceholder} />
      </HeaderWrapper>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: headerH + headerFadeExtra,
        }}
      />
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  side: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  sidePlaceholder: {
    width: 44,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default GroupScreen;
