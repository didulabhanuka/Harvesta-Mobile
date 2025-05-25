// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import {
//   Ionicons,
//   MaterialCommunityIcons,
//   FontAwesome5,
// } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

// export default function PestResultScreen({ route }) {
//   const navigation = useNavigation();
//   const { result } = route.params;
//   const { pest, probability, harms, remedies } = result.pest;

//   return (
//     <View style={styles.container}>
//       {/* Header with Back Button */}

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Pest Info Section */}
//         <View style={styles.section}>
//           <MaterialCommunityIcons name="bug" size={28} color="#40B59F" />
//           <Text style={styles.sectionTitle}>Pest Detected</Text>
//           <Text style={styles.sectionValue}>{pest}</Text>
//         </View>

//         {/* Probability */}
//         {/* <View style={styles.section}>
//           <FontAwesome5 name="percentage" size={24} color="#40B59F" />
//           <Text style={styles.sectionTitle}>Probability</Text>
//           <Text style={styles.sectionValue}>
//             {(probability * 100).toFixed(2)}%
//           </Text>
//         </View> */}

//         {/* Harms */}
//         <View style={styles.section}>
//           <MaterialCommunityIcons
//             name="alert-octagon"
//             size={26}
//             color="#E66A6A"
//           />
//           <Text style={styles.sectionTitle}>Harms</Text>
//           {harms.map((harm, index) => (
//             <Text key={index} style={styles.bullet}>
//               • {harm}
//             </Text>
//           ))}
//         </View>

//         {/* Remedies */}
//         <View style={styles.section}>
//           <MaterialCommunityIcons name="spray" size={26} color="#40B59F" />
//           <Text style={styles.sectionTitle}>Recommended Remedies</Text>
//           {remedies.map((remedy, index) => (
//             <Text key={index} style={styles.bullet}>
//               • {remedy}
//             </Text>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#40B59F",
//     paddingTop: 50,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   content: {
//     padding: 20,
//   },
//   section: {
//     marginBottom: 24,
//     backgroundColor: "#F1F9F8",
//     borderRadius: 10,
//     padding: 16,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#40B59F",
//     marginTop: 8,
//   },
//   sectionValue: {
//     fontSize: 18,
//     color: "#333",
//     fontWeight: "500",
//     marginTop: 4,
//   },
//   bullet: {
//     fontSize: 15,
//     color: "#555",
//     marginTop: 6,
//     marginLeft: 4,
//   },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PestResultScreen({ route }) {
  const navigation = useNavigation();
  const { result } = route.params;
  const { pest, probability, harms, remedies } = result.pest;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pest Info */}
        <View style={styles.section}>
          <View style={styles.iconTitleRow}>
            <MaterialCommunityIcons name="bug" size={28} color="#40B59F" />
            <Text style={styles.sectionTitle}>Pest Detected</Text>
          </View>
          <Text style={styles.pestName}>{pest}</Text>
        </View>

        {/* Harms */}
        <View style={styles.section}>
          <View style={styles.iconTitleRow}>
            <MaterialCommunityIcons
              name="alert-octagon"
              size={26}
              color="#E66A6A"
            />
            <Text style={styles.sectionTitle}>Harms</Text>
          </View>
          {harms.map((harm, index) => (
            <View key={index} style={styles.bulletRow}>
              <Entypo name="dot-single" size={20} color="#E66A6A" />
              <Text style={styles.bulletText}>{harm}</Text>
            </View>
          ))}
        </View>

        {/* Remedies */}
        <View style={styles.section}>
          <View style={styles.iconTitleRow}>
            <MaterialCommunityIcons name="spray" size={26} color="#40B59F" />
            <Text style={styles.sectionTitle}>Recommended Remedies</Text>
          </View>
          {remedies.map((remedy, index) => (
            <View key={index} style={styles.bulletRow}>
              <Entypo name="dot-single" size={20} color="#40B59F" />
              <Text style={styles.bulletText}>{remedy}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#F1F9F8",
    borderRadius: 12,
    padding: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  pestName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#40B59F",
    marginTop: 6,
    marginLeft: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
    marginLeft: 4,
  },
  bulletText: {
    fontSize: 15.5,
    color: "#444",
    lineHeight: 22,
    flex: 1,
  },
});
