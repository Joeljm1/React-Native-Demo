import {
  Text,
  TextInput,
  View,
  SectionList,
  Pressable,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { Expense } from "@/expenseData";
import ExpenseData from "@/expenseData";

type ModalType = "add" | "delete" | null;

export default function ExpenseTracker() {
  const [data, setData] = useState<Expense[]>(ExpenseData);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [modalType, setModalType] = useState<ModalType>(null);

  const total = data.reduce((sum, expense) => sum + expense.amount, 0);
  const count = data.length;
  const thisMonthTotal = data
    .filter((d) => {
      const date = new Date(d.date);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const getDateTitle = (dateStr: string) => {
    const expenseDate = new Date(dateStr);
    if (isNaN(expenseDate.getTime())) {
      return "Other";
    }

    const today = new Date();
    const expenseDateClean = new Date(
      expenseDate.getFullYear(),
      expenseDate.getMonth(),
      expenseDate.getDate(),
    );
    const todayClean = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const diffTime = todayClean.getTime() - expenseDateClean.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return expenseDate.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const sortedExpenses = [...filteredData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const groups: { [key: string]: Expense[] } = {};
  sortedExpenses.forEach((expense) => {
    const title = getDateTitle(expense.date);
    if (!groups[title]) {
      groups[title] = [];
    }
    groups[title].push(expense);
  });

  const sections = Object.keys(groups).map((title) => ({
    title,
    data: groups[title],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <StatsCard total={total} count={count} thisMonthTotal={thisMonthTotal} />

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderTopStartRadius: 20,
          padding: 20,
        }}
      >
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#8E9AA0" />
          <TextInput
            placeholder="Search expenses..."
            placeholderTextColor="#8E9AA0"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search !== "" && (
            <Pressable onPress={() => setSearch("")} style={{ padding: 4 }}>
              <FontAwesome name="times-circle" size={16} color="#8E9AA0" />
            </Pressable>
          )}
        </View>

        <Modal
          visible={modalType === "add"}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalType(null)}
        >
          <AddExpenseModal
            onSubmit={(newExpense) => {
              setData([...data, newExpense]);
              setModalType(null);
            }}
            onClose={() => setModalType(null)}
          />
        </Modal>
        <Modal
          visible={modalType === "delete"}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalType(null)}
        >
          <DeleteConfirmationModal
            onConfirm={() => {
              setData(data.filter((d) => d.id !== deleteId));
              setDeleteId("");
              setModalType(null);
            }}
            onCancel={() => setModalType(null)}
          />
        </Modal>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
          renderItem={({ item }) => (
            <ExpenseItem
              expense={item}
              onDelete={() => {
                setDeleteId(item.id);
                setModalType("delete");
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderTitle}>{title}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome name="folder-open-o" size={48} color="#C4CBD0" />
              <Text style={styles.emptyText}>
                {search
                  ? "No matching expenses found."
                  : "No expenses added yet."}
              </Text>
            </View>
          }
        />

        <Pressable
          onPress={() => setModalType("add")}
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
  onDelete,
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
          onPress={onDelete}
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
    <View style={styles.addModalBg}>
      <View style={styles.modalCard}>
        <View style={styles.sheetHandle} />

        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <FontAwesome name="times" size={16} color="#64748B" />
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

function DeleteConfirmationModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <View style={styles.deleteModalBg}>
      <View style={styles.deleteModalCard}>
        <Text style={styles.modalTitle}>Delete Expense</Text>
        <Text style={{ color: "#475569", marginTop: 8 }}>
          Are you sure you want to delete this expense?
        </Text>

        <View style={styles.modalActions}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.btn,
              styles.btnCancel,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.btnTextCancel}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.btn,
              styles.btnPrimary,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnTextPrimary}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function StatsCard({
  total,
  count,
  thisMonthTotal,
}: {
  total: number;
  count: number;
  thisMonthTotal: number;
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
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statVal}>${thisMonthTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#064E3B",
    paddingTop: "10%",
  },
  headerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  headerLabel: {
    color: "#D1FAE5",
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
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    color: "#D1FAE5",
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
    paddingHorizontal: 16,
    paddingVertical: 4,
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
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addModalBg: {
    flex: 1,
    justifyContent: "flex-end",
  },

  deleteModalBg: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopStartRadius: 20,
    width: "100%",
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 24,
  },
  deleteModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    width: "100%",
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalClose: {
    padding: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8, // Sharper modern rounded corner
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
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
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#059669",
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
  sectionHeaderContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
