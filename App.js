//F_P=final price
//T_p=total price
//D_per=dicount percentage
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TextInput,
  ScrollView,
  Modal,
  Button,
  TouchableWithoutFeedback,
  ToastAndroid,
  Alert
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default function App() {
  const [F_P, setF_P] = useState(null);
  const [T_P, setT_P] = useState(null);
  const [D_Per, setD_Per] = useState(null);
  const [isSaveButtonEnabled, setisSaveButtonEnabled] = useState(false);
  const [History, setHistory] = useState([]);
  const [M_V, setM_V] = useState(false);

  const saveCalculations = () => {
    ToastAndroid.show("Saved!", 1000);
    setHistory((prev) => [
      ...prev,
      {
        T_P: T_P,
        D_Per: D_Per,
        Saving: Math.round(T_P - F_P),
        F_P: Math.round(F_P),
      },
    ]);
    setisSaveButtonEnabled(false);
  };

  const openModal = () => {
    if(History.length > 0) setM_V(true);
    else ToastAndroid.show("No Records!",1000)
  };
  const clearHistory = () => {
    if(History.length > 0) {
    Alert.alert("Do you want to clear the History",
     [
        {
          text: "No",
          onPress: () => {},
        },
        { text: "Yes", onPress: () => setHistory([]) }
      ])

    }
    else{
      ToastAndroid.show("No History!",1000)
    }
  }

  const deleteItem = (index) => {
    const newHistroy = History.filter((_,i) => i!=index)
    setHistory(newHistroy)
  }

  const HistoryModal = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={M_V}>
        <View style={styles.centeredView}>
          <View
            style={
              (styles.modalView,
              {
                borderRadius: 20,
                height: 'auto',
                width:200,
                backgroundColor: "#ffcfe2",
              })
            }
          >
            <ScrollView>
              {History.length == 0 ? (
                <View style={{ padding: 10 }}>
                  <Text>No History to show</Text>
                </View>
              ) : (
                History.map((item, index) => (
                  <View key={index} style={{ padding: 10,flex:1 }}>
                    <View>
                        <Text style={{ fontSize: 16 }}>Item : {index + 1}</Text>
                        <Text>Original Price : {item.T_P}</Text>
                        <Text>Discount : {item.D_Per} %</Text>
                        <Text>You Saved : {item.Saving}</Text>
                        <Text>Final Price : {item.F_P}</Text>
                    </View>
                    <View style={{justifyContent:"flex-end",alignItems:'flex-end'}}>
                        <TouchableWithoutFeedback onPress={() => deleteItem(index)}>
                            <Text style={{color:'red'}}>
                            Delete
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableWithoutFeedback
              style={{ ...styles.openButton }}
              onPress={() => {
                console.log("setting modal false");
                setM_V(false);
              }}
            >
              <Text
                style={
                  (styles.textStyle,
                  {
                    ...styles.openButton,
                    color: "white",
                    padding: 10,
                    
                    textAlign: "center",
                    backgroundColor: "black",
                    justifyContent: "center",
                    alignItems: "center",
                  })
                }
              >
                Close
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    if (T_P == "" || D_Per == "") {
      setF_P(null);
      setisSaveButtonEnabled(false);
    } else if (T_P != null && D_Per != null) {
      if (
        D_Per >= 0 &&
        D_Per < 101 &&
        T_P >= 0
      ) {
        let F_P =
          T_P - (D_Per / 100) * T_P;
        setF_P(F_P);
        setisSaveButtonEnabled(true);
      } else {
        ToastAndroid.show("Enter Valid Discount", 1000);
        setisSaveButtonEnabled(false);
      }
    }
  }, [T_P, D_Per]);
  return (
    <View style={styles.container}>
      {<HistoryModal />}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.input4}>Discount Calculator</Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-end",
          padding: 10,
         

        }}
      >
        <TouchableWithoutFeedback
          onPress={openModal}
        >
          <Text style={styles.input2}>View History</Text>
          
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          
          onPress={clearHistory}
        >
          <Text style={styles.input2}>Clear History</Text>
          
        </TouchableWithoutFeedback>
      </View>
      {F_P != null && (
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.input3}>
            You Saved{"    "}{" "}
            {Math.round(
              Math.max(T_P, F_P) -
                Math.min(T_P, F_P)
            )}
          </Text>
          <Text style={styles.input3}>
            Final Price {"    "}
            {Math.round((F_P * 100) / 100)}
          </Text>
        </View>
      )}
      <View style={{ flex: 5, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          defaultValue={0}
          style={styles.input}
          placeholder="Total Price"
          keyboardType="numeric"
          onChangeText={(e) => setT_P(e)}
        />
        <TextInput
          defaultValue={0}
          style={styles.input}
          placeholder="Discount %"
          keyboardType="numeric"
          maxLength={3}
          onChangeText={(e) => setD_Per(e)}
        />
      </View>

      <Button
        disabled={!isSaveButtonEnabled}
        title="Save"
        color="#841584"
        onPress={saveCalculations}
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },

  // modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  input:{
    fontSize: 20,
    textAlign: "center",
    padding: 5 ,
    width:150,
    borderColor:"#777",
    borderWidth: 2,
    borderRadius: 20,
    marginBottom: 8

  },
  input2:{
    fontSize: 14,
    color: "#841584",
    width:90,
    textAlign: "center" ,
    borderColor:"#841584",
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 2

  },
  input3:{
    fontSize: 18,
    color: "#841584",
    textAlign: "center" ,
    borderColor:"#841584",
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 2,
    width:150

  },
  input4:{
    fontSize: 30,
    color:"#841584",
    borderColor:"#841584",
    width:300,
    borderWidth: 3,
    borderRadius: 5,
    textAlign: "center",
    fontWeight: "bold",

  }
});