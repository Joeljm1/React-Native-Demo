import {
  Text,
  TextInput,
  View,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Expense } from "@/expenseData";
import ExpenseData from "@/expenseData";

export default function ExpenseTracker() {
  const [data, setData] = useState<Expense[]>(ExpenseData);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const total = data.reduce((sum, expense) => sum + expense.amount, 0);
  const count = data.length;
  const highest = data.length > 0 ? Math.max(...data.map((d) => d.amount)) : 0;

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <StatsCard total={total} count={count} highest={highest} />

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderTopStartRadius: 20,
          padding: 20,
        }}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#8E9AA0" />
          <TextInput
            placeholder="Search expenses..."
            placeholderTextColor="#8E9AA0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery !== "" && (
            <Pressable
              onPress={() => setSearchQuery("")}
              style={{ padding: 4 }}
            >
              <FontAwesome name="times-circle" size={16} color="#8E9AA0" />
            </Pressable>
          )}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
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

        {/* Expense List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onDelete={() => {
                setData(data.filter((d) => d.id !== item.id));
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome name="folder-open-o" size={48} color="#C4CBD0" />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No matching expenses found."
                  : "No expenses added yet."}
              </Text>
            </View>
          }
        />

        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.floatingBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] },
          ]}
        >
          <FontAwesome name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function ExpenseItem({
  expense,
  onDelete: deleteItem,
}: {
  expense: Expense;
  onDelete: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.cardIcon}>
          <FontAwesome name="usd" size={16} color="#4B5563" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {expense.title}
          </Text>
          <Text style={styles.cardDate}>
            {new Date(expense.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardAmount}>-${expense.amount.toFixed(2)}</Text>
        <Pressable
          onPress={deleteItem}
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <FontAwesome name="trash" size={14} color="#EF4444" />
        </Pressable>
      </View>
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
  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");

  function handleAdd() {
    let hasError = false;
    setTitleError("");
    setAmountError("");

    if (!title.trim()) {
      setTitleError("Expense title is required");
      hasError = true;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount.trim()) {
      setAmountError("Amount is required");
      hasError = true;
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("Enter a valid positive number");
      hasError = true;
    }

    if (hasError) return;

    const newExpense: Expense = {
      id: Math.random().toString(),
      title: title.trim(),
      amount: parsedAmount,
      date: new Date().toISOString(),
    };
    onSubmit(newExpense);
  }

  return (
    <View style={styles.modalBg}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <FontAwesome name="times" size={18} color="#8E9AA0" />
          </Pressable>
        </View>

        <Text style={styles.inputLabel}>Title</Text>
        <TextInput
          placeholder="e.g. Groceries"
          placeholderTextColor="#8E9AA0"
          value={title}
          onChangeText={setTitle}
          style={[styles.input, titleError ? { borderColor: "#EF4444" } : null]}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

        <Text style={styles.inputLabel}>Amount ($)</Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor="#8E9AA0"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={[
            styles.input,
            amountError ? { borderColor: "#EF4444" } : null,
          ]}
        />
        {amountError ? (
          <Text style={styles.errorText}>{amountError}</Text>
        ) : null}

        <View style={styles.modalActions}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.btn,
              styles.btnCancel,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.btnTextCancel}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnTextPrimary}>Add Expense</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatsCard({
  total,
  count,
  highest,
}: {
  total: number;
  count: number;
  highest: number;
}) {
  return (
    <View style={styles.headerCard}>
      <Text style={styles.headerLabel}>Total Expenses</Text>
      <Text style={styles.headerTotal}>${total.toFixed(2)}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Transactions</Text>
          <Text style={styles.statVal}>{count}</Text>
        </View>
        <View style={[styles.statCol, { alignItems: "flex-end" }]}>
          <Text style={styles.statLabel}>Highest Expense</Text>
          <Text style={styles.statVal}>${highest.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    paddingTop: "10%",
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  headerLabel: {
    color: "#9EA7AD",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTotal: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2F3539",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    color: "#9EA7AD",
    fontSize: 11,
    marginBottom: 2,
  },
  statVal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E9EB",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1E2022",
    marginLeft: 8,
    height: "100%",
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E2022",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#8E9AA0",
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E2022",
    marginRight: 12,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    color: "#8E9AA0",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  floatingBtn: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "100%",
    maxWidth: 380,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E2022",
  },
  modalClose: {
    padding: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E9EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1E2022",
    backgroundColor: "#F8F9FA",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A545A",
    marginBottom: 6,
    marginTop: 12,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#2563EB",
  },
  btnCancel: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnTextPrimary: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  btnTextCancel: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 15,
  },
});
