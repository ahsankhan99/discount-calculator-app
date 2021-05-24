import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function HomeScreen({ route, navigation }) {
  const [getPrice, setPrice] = useState('');
  const [getDiscount, setDiscount] = useState('');
  const [getHistory, setHistory] = useState([]);
  const [buttonDisabler, setButtonDisabler] = useState(true);

  useEffect(() => {
    if (route.params?.getHistoryList) {
      setHistory(route.params?.getHistoryList);
    }
  }, [route.params?.getHistoryList]);

  useEffect(() => {
    getPrice.length != 0 && getDiscount.length != 0
      ? setButtonDisabler(false)
      : setButtonDisabler(true);
  }, [getDiscount.length, getPrice.length, buttonDisabler]);

  const checkPrice = (text) => {
    if (text > 0 || text == '') {
      setPrice(text);
    }
  };

  const checkDiscount = (text) => {
    if (text >= 0 && text <= 100) {
      setDiscount(text);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 50,
            backgroundColor: '#F8F8F8',
          }}
          onPress={() => navigation.navigate('History', { getHistory })}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#8689C1',
            }}>
            <FontAwesome name="history" size={24} />
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discount App</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#5C5C5C"
        onChangeText={(text) => {
          checkPrice(text);
          getPrice.length != 0 && getDiscount.length != 0
            ? setButtonDisabler(false)
            : setButtonDisabler(true);
        }}
        value={getPrice}
        placeholder="Original Price"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#5C5C5C"
        onChangeText={(text) => {
          checkDiscount(text);
        }}
        value={getDiscount}
        placeholder="Discount Percentage"
        keyboardType="numeric"
      />

      <Text style={styles.textStyle}>
        You Save: {parseFloat((getDiscount / 100) * getPrice).toFixed(2)}
      </Text>
      <Text style={styles.textStyle}>
        Final Price:{' '}
        {parseFloat(getPrice - (getDiscount / 100) * getPrice).toFixed(2)}
      </Text>

      <TouchableOpacity
        disabled={buttonDisabler}
        onPress={() => {
          var calculation = {
            originalPrice: getPrice,
            discountPercentage: getDiscount,
            discountedPrice: parseFloat(
              getPrice - (getDiscount / 100) * getPrice
            ).toFixed(2),
          };
          setHistory([...getHistory, calculation]);
          setPrice('');
          setDiscount('');
          setButtonDisabler(true);
        }}
        style={{
          marginTop: 40,
          backgroundColor: buttonDisabler ? '#C2C2C2' : '#F8F8F8',
          paddingVertical: 3,
          paddingHorizontal: 60,
          borderRadius: 40,
          shadowColor: '#7c46e0',
          elevation: 10,
          shadowRadius: 3,
          shadowOffset: { width: 5, height: 6 },
          shadowOpacity: 1,
        }}>
        <Text style={{ color: '#7c46e0', fontWeight: 'bold', fontSize: 24 }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function HistoryScreen({ route, navigation }) {
  const { getHistory } = route.params;
  const [getHistoryList, setHistoryList] = useState(getHistory);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);

  const remove = (value) => {
    var list = getHistoryList.filter((item) => item != value);
    setHistoryList(list);
    setDeleteStatus(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Clear all items?</Text>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      borderRadius: 50,
                      backgroundColor: '#C2C2C2',
                    }}
                    onPress={() => {
                      navigation.navigate({
                        name: 'Discount App',
                        params: { getHistoryList: [] },
                        merge: true,
                      });
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#7c46e0',
                      }}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      borderRadius: 50,
                      backgroundColor: '#C2C2C2',
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#7c46e0',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            disabled={getHistoryList.length > 0 ? false : true}
            style={{
              marginRight: 10,
              padding: 5,
              borderRadius: 2,
              backgroundColor:
                getHistoryList.length > 0 ? '#F8F8F8' : '#C2C2C2',
            }}
            onPress={() => setModalVisible(true)}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: '#7c46e0' }}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Original Price</DataTable.Title>
            <DataTable.Title numeric>Discount</DataTable.Title>
            <DataTable.Title numeric>Final Price</DataTable.Title>
            <DataTable.Title numeric>
              <TouchableOpacity
                disabled={!deleteStatus}
                style={{
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 2,
                  backgroundColor: deleteStatus ? '#F8F8F8' : '#C2C2C2',
                }}
                onPress={() => {
                  navigation.navigate({
                    name: 'Discount App',
                    params: { getHistoryList: getHistoryList },
                    merge: true,
                  });
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#7c46e0',

                  }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </DataTable.Title>
          </DataTable.Header>

          {getHistoryList.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.originalPrice}</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.discountPercentage}%
              </DataTable.Cell>
              <DataTable.Cell numeric>{item.discountedPrice}</DataTable.Cell>
              <DataTable.Cell numeric>
                <TouchableOpacity
                  onPress={() => {
                    console.log(index);
                    remove(item);
                  }}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Discount App"
          component={HomeScreen}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#F8F8F8',
              textShadowColor: '#7c46e0',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 1,
              fontSize: 22,
            },
            headerStyle: {
              backgroundColor: '#8689C1',
            },
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#F8F8F8',
              textShadowColor: '#7c46e0',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 1,
              fontSize: 22,
              textAlign: 'center',
            },
            headerStyle: {
              backgroundColor: '#8689C1',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#A0A2CF',
  },
  input: {
    height: 40,
    width: 220,
    fontSize: 18,
    margin: 12,
    padding: 5,
    borderWidth: 3,
    borderRadius: 2,
    borderColor: '#7c46e0',
    color: 'black',
    backgroundColor: '#D6D6D6',
  },
  header: {
    fontSize: 45,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#F8F8F8',
    textShadowColor: '#7c46e0',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginTop: 40,
    marginBottom: 10,
  },
  textStyle: {
    marginTop: 10,
    fontSize: 24,
    color: '#F8F8F8',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: 250,
    height: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    color: '#7c46e0',
    textAlign: 'center',
  },
});

export default App;
