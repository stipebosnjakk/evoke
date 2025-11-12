import React, { useState } from "react";
import { View, TextInput, Button, Text, FlatList } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { addTask, removeTask } from "@/store/features/tasks/taskSlice";

const TaskScreen = () => {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="New todo..."
        value={text}
        onChangeText={setText}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button
        title="Add Todo"
        onPress={() => {
          if (text.trim()) {
            dispatch(addTask({ id: Date.now().toString(), title: text }));
            setText("");
          }
        }}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              marginVertical: 4,
              backgroundColor: item.completed ? "#a7f3d0" : "#f3f4f6",
              borderRadius: 6,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textDecorationLine: item.completed ? "line-through" : "none",
              }}
            >
              {item.title}
            </Text>
            <Button title="Delete" onPress={() => dispatch(removeTask(item.id))} />
          </View>
        )}
      />
    </View>
  );
};

export default TaskScreen;
