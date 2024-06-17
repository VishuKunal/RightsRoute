import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import SubSubCategoryScreen from './crime_4';

import client from '../api/client';

const Stack = createStackNavigator();

const SubCategoryScreen = ({ route, navigation }) => {
  const { searchData } = route?.params;
  // const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCrime, setSelectedCrime] = useState({ name: '', description: '' });

  const handleBoxPress = async (categoryName, crimeDescription) => {
    setSelectedCrime({ name: categoryName, description: crimeDescription });
    setModalVisible(true);
  };

  const handleCardPress = async (categoryName) => {
    try {
      const response = await client.get(`/search-users3?query=${categoryName}`);

      // Process the response data as needed
      const searchData = response.data;

      if(searchData.length===0)
      {
        const response2 = await client.get(`/search-users4?query=${categoryName}`);

      // Process the response data as needed
      const searchData2 = response2.data;

      navigation.navigate("CrimeDetailsScreen",{crimeDetails: searchData2[0] })

      }
      else{

      navigation.navigate("SubSubCategoryScreen", { searchData });
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crime Categories</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedCrime.name}</Text>
          <Text style={styles.modalDescription}>{selectedCrime.description}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.cardContainer}>
        {searchData.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardPress(category.name)}
          >
            <Text style={styles.cardTitle}>{category.name}</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => handleBoxPress(category.name, category.description)}
            >
              
                <Text style={styles.infoButtonText}>i</Text>
              
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    marginTop: 40,
    paddingBottom: 50
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: -200,
    width: 200,
  },
  card: {
    position: 'relative',
    flex: 1,
    backgroundColor: "rgba(27, 27, 51, 0.98)",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 18,
    elevation: 5,
    width: 300,
    height: 200,
    margin: 5,
    marginLeft: -70,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  InfoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(27, 27, 51, 0.98)',
  },
  modalContainer: {
    flex:1,
    alignContent: 'center',
    justifyContent:'center',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  modalDescription: {
    fontSize: 18,
    marginBottom: 20,
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: 'rgba(27, 27, 51, 0.98)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubCategoryScreen;



