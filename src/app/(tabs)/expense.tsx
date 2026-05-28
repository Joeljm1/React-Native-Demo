import {
  Text,
  TextInput,
  View,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import type { Expense } from "@/expenseData";
import ExpenseData from "@/expenseData";

export default function ExpenseTracker() {
  const [data, setData] = useState<Expense[]>(ExpenseData);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <AddExpenseModal
          onSubmit={(newExpense) => {
            setData([...data, newExpense]);
            setModalVisible(false);
          }}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Expense Tracker</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onDelete={() => {
              setData(data.filter((d) => d.id !== item.id));
            }}
          />
        )}
        style={{ width: "100%" }}
      />
      <Text style={{ color: "#888" }}>
        Total: $
        {data.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
      </Text>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 5,
        }}
      >
        <Text>Add Expense</Text>
      </Pressable>
    </View>
  );
}

function ExpenseItem({
  expense,
  onDelete: deleteItem,
}: {
  expense: Expense;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 18 }}>{expense.title}</Text>
      <Text style={{ color: "#888" }}>${expense.amount.toFixed(2)}</Text>
      <Text style={{ color: "#888" }}>
        {new Date(expense.date).toLocaleDateString()}
      </Text>
      <Pressable
        onPress={() => deleteItem(expense.id)}
        style={{
          marginTop: 5,
          padding: 5,
          backgroundColor: "#f00",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff" }}>Delete</Text>
      </Pressable>
    </View>
  );
}

function AddExpenseModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (expense: Expense) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: 10,
          backgroundColor: "#ccc",
          borderRadius: 5,
        }}
      >
        <Text>Close</Text>
      </Pressable>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Add Expense</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          width: "80%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          marginTop: 20,
        }}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{
          width: "80%",
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          marginTop: 10,
        }}
      />
      <Pressable
        onPress={() => {
          const newExpense: Expense = {
            id: Math.random().toString(),
            title,
            amount: parseFloat(amount),
            date: new Date().toISOString(),
          };
          onSubmit(newExpense);
        }}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: "#007bff",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff" }}>Add</Text>
      </Pressable>
    </View>
  );
}

const st = StyleSheet.create({});
