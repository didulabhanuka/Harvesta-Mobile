// // /screens/pest/PestMainMenuScreen.js

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import LottieView from "lottie-react-native";

// const { width: screenWidth } = Dimensions.get("window");

// export default function PestMainMenuScreen() {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.headerText}>Pest Assistant</Text>

//       <TouchableOpacity
//         style={styles.tile}
//         onPress={() => navigation.navigate("UploadPestImage")}
//       >
//         <View style={styles.lottieContainer}>
//           <LottieView
//             source={require("../../assets/jsons/pest-upload.json")} // Sample Lottie file
//             autoPlay
//             loop
//             style={styles.lottie}
//           />
//         </View>
//         <Image
//           source={require("../../assets/jsons/pest-upload.json")} // Sample static image
//           style={styles.iconImage}
//         />
//         <Text style={styles.tileText}>Detect Pests</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.tile}
//         onPress={() => navigation.navigate("PestHistory")}
//       >
//         <View style={styles.lottieContainer}>
//           <LottieView
//             source={require("../../assets/jsons/pest-upload.json")} // Another sample Lottie file
//             autoPlay
//             loop
//             style={styles.lottie}
//           />
//         </View>
//         <Image
//           source={require("../../assets/jsons/pest-upload.json")} // Sample static image
//           style={styles.iconImage}
//         />
//         <Text style={styles.tileText}>View History</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#40B59F",
//     marginBottom: 30,
//   },
//   tile: {
//     backgroundColor: "#E8F6F3",
//     borderRadius: 12,
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     alignItems: "center",
//     width: screenWidth * 0.85,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   lottieContainer: {
//     width: 120,
//     height: 120,
//     marginBottom: 10,
//   },
//   lottie: {
//     width: "100%",
//     height: "100%",
//   },
//   iconImage: {
//     width: 30,
//     height: 30,
//     marginBottom: 10,
//   },
//   tileText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

export default function PestMainMenuScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Pest Assistant</Text>

      <TouchableOpacity
        style={styles.tile}
        onPress={() => navigation.navigate("UploadPestImage")}
      >
        <Image
          source={require("../../assets/scan-pest.gif")}
          style={styles.tileImage}
        />
        <Text style={styles.tileText}>Detect Pests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tile, { marginBottom: 0 }]} // Remove extra space at bottom
        onPress={() => navigation.navigate("PestHistory")}
      >
        <Image
          source={require("../../assets/pest-history.gif")}
          style={styles.tileImage}
        />
        <Text style={styles.tileText}>View History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center", // Center vertically
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#40B59F",
    marginBottom: 30,
  },
  tile: {
    backgroundColor: "#E8F6F3",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    width: screenWidth * 0.85,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  tileImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: "contain",
  },
  tileText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
