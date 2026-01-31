import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { SymbolView } from "expo-symbols";

const Header = ({ options }: BottomTabHeaderProps) => {
  const insets = useSafeAreaInsets();
  const title = options?.title ?? "header";
  console.log(title)

  const onSearch = () => {};
  const onCreate = () => {};
  const onQuickAdd = () => {};

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
      }}
    >
      <View
        style={{
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <View style={{ width: 36, alignItems: "flex-start" }}>
          <Pressable
            onPress={onSearch}
            hitSlop={10}
            style={{
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name="magnifyingglass"
              size={24}
              type="monochrome"
              tintColor="#111827"
            />
          </Pressable>
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={onQuickAdd}
            hitSlop={10}
            style={{
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <SymbolView
              name="bolt.fill"
              size={24}
              type="monochrome"
              tintColor="#111827"
            />
          </Pressable>
          <Pressable
            onPress={onCreate}
            hitSlop={10}
            style={{
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name="plus"
              size={24}
              type="monochrome"
              tintColor="#111827"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default Header;
