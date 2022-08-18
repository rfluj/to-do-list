
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from "react-navigation";
import React from "react";
import { useState } from "react";

// class MyBackButton extends React.Component {
//     render() {
//       return <Button title="Back" onPress={() => { this.props.navigation.goBack() }} />;
//     }
//   }
  
  // withNavigation returns a component that wraps MyBackButton and passes in the
  // navigation prop
//   export default withNavigation(MyBackButton);

export default function BottomNavigationBar({navigation}) {
    const [keyboardOn, setKeyboardOn] = useState(false)
    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setKeyboardOn(true)
        }
    );
    const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setKeyboardOn(false)
        }
    );
    if (keyboardOn) {
        return (
            <View></View>
        )
    }
    return (
        <View style={style.container}>
            <View style={[style.tapBar]}>
                <TouchableOpacity onPress={() => navigation.navigate('Home', {navigation: navigation})}>
                    <Icon name="home" size={35} color={'rgb(125, 125, 125)'}/>
                    <Text style={style.text}>Home</Text>
                </TouchableOpacity>
            </View>
            <View style={[style.tapBar]}>
                <TouchableOpacity onPress={() => navigation.navigate('AddTask', {navigation: navigation})}>
                    <View style={style.circleBorder}>
                        <Icon name="plus" size={35} color={'#fff'} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[style.tapBar]}>
                <TouchableOpacity onPress={() => navigation.navigate('Activity', {navigation: navigation})}>
                    <Ionicons name="ios-bar-chart" size={35} color={'rgb(125, 125, 125)'} />
                    <Text style={style.text}>Activity</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        height: 80,
        backgroundColor: "#fff",
        flexDirection: "row",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    flex: {
        flex: 1,
    },
    tapBar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "rgb(81, 81, 81)"
    },
    circleBorder: {
        width: 55,
        height: 55,
        borderRadius: 50,
        backgroundColor: "rgb(97, 53, 188)",
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 10,
    }
})

// export default withNavigation(BottomNavigationBar);


