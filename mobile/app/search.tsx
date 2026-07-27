import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { useDebouncedCallback } from "use-debounce";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/ui/CustomButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { routes } from "@/constants/routes";
import type { SearchResults } from "@/db/repositories/search.repo";
import { useAppDispatch } from "@/hooks/storeHooks";
import { searchTasksAndProjectsAction } from "@/store/thunks/search.thunks";
import Task from "@/components/task/Task";

const EMPTY_RESULTS: SearchResults = {
  tasks: [],
  projects: [],
};

const SearchScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);

  const handleSearch = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(EMPTY_RESULTS);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await dispatch(searchTasksAndProjectsAction(query)).unwrap();
      setResults(res);
    } catch (error) {
      setResults(EMPTY_RESULTS);
      console.error("Failed to search for tasks and projects", error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const handleRemoveSearch = () => {
    handleSearch.cancel();
    setResults(EMPTY_RESULTS);
    setIsSearching(false);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);

    if (!query.trim()) {
      handleRemoveSearch();
      return;
    }

    handleSearch(query);
  };

  const handleClear = () => {
    handleRemoveSearch();
    setSearch("");
  };

  const handleGoBack = () => {
    handleSearch.cancel();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(routes.today.href);
    }
  };

  return (
    <ScreenWrapper>
      <HeaderWrapper>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <CustomButton onPress={handleGoBack}>
              <SymbolView
                name="chevron.left"
                size={22}
                type="monochrome"
                tintColor="#111827"
              />
            </CustomButton>
          </View>
          <View style={styles.searchBar}>
            <SymbolView
              name="magnifyingglass"
              size={17}
              type="monochrome"
              tintColor="#6B7280"
            />
            <TextInput
              value={search}
              onChangeText={handleSearchChange}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              placeholder="Search tasks and projects"
              placeholderTextColor="#6B7280"
              selectionColor="#111827"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <Pressable
                onPress={handleClear}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <SymbolView
                  name="xmark.circle.fill"
                  size={17}
                  type="monochrome"
                  tintColor="#8E8E93"
                />
              </Pressable>
            )}
          </View>
        </View>
      </HeaderWrapper>
      {isSearching && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      )}
      {!isSearching && (
        <ScrollView
          style={[
            styles.dataContainer,
            { paddingTop: headerH + headerFadeExtra },
          ]}
          contentContainerStyle={styles.dataContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {results.tasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <View style={styles.taskList}>
                {results.tasks.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
              </View>
            </View>
          )}
          {results.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              <View style={styles.projectList}>
                {results.projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectRow}
                    onPress={() => {
                      router.push({
                        pathname: routes.single_project.href,
                        params: { projectId: project.id },
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.projectColor,
                        { backgroundColor: project.color },
                      ]}
                    />
                    <Text style={styles.projectTitle} numberOfLines={1}>
                      {project.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  searchBar: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#F1F1F1",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    color: "#111827",
    fontSize: 15,
    fontWeight: "400",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  dataContainer: {
    flex: 1,
  },
  dataContent: {
    paddingTop: 20,
    paddingBottom: 32,
    gap: 26,
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    marginBottom: 14,
    color: "#111827",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
  },
  taskList: {
    width: "100%",
  },
  projectList: {
    width: "100%",
    gap: 4,
  },
  projectRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  projectColor: {
    width: 10,
    height: 10,
    marginRight: 12,
    borderRadius: 5,
  },
  projectTitle: {
    flex: 1,
    color: "#1F1F1D",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
});

export default SearchScreen;
