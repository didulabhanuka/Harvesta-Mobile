import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPestHistory } from "../../services/pestService";

export default function PestHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getPestHistory();
      setHistory(data.reverse()); // Show latest first
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: `https://d437-2402-4000-2380-a01c-e4dd-a862-48a2-23f9.ngrok-free.app/${item.image_path}`,
        }}
        style={styles.image}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.pestName}>{item.pest_name}</Text>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => setSelectedItem(item)}
        >
          <Ionicons name="information-circle-outline" size={18} color="#fff" />
          <Text style={styles.viewMoreText}>View More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#40B59F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Modal for details */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedItem?.pest_name}</Text>
              <Text style={styles.label}>
                Probability:{" "}
                <Text style={styles.value}>{selectedItem?.probability}</Text>
              </Text>
              <Text style={styles.label}>
                Detected at:{" "}
                <Text style={styles.value}>
                  {new Date(selectedItem?.timestamp).toLocaleString()}
                </Text>
              </Text>

              <Text style={styles.label}>Harms:</Text>
              {selectedItem?.harms?.map((h, i) => (
                <Text key={i} style={styles.bullet}>
                  • {h}
                </Text>
              ))}

              <Text style={styles.label}>Remedies:</Text>
              {selectedItem?.remedies?.map((r, i) => (
                <Text key={i} style={styles.bullet}>
                  • {r}
                </Text>
              ))}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons name="close-circle" size={22} color="#fff" />
                <Text style={styles.viewMoreText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#E8F6F3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  pestName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  viewMoreButton: {
    flexDirection: "row",
    backgroundColor: "#40B59F",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewMoreText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#40B59F",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#444",
  },
  value: {
    fontWeight: "400",
    color: "#333",
  },
  bullet: {
    fontSize: 15,
    marginTop: 4,
    color: "#555",
    marginLeft: 8,
  },
  closeButton: {
    flexDirection: "row",
    backgroundColor: "#E66A6A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
