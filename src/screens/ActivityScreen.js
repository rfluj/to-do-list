
import { View, Text, StyleSheet } from "react-native";
import BottomNavigationBar from "../components/BottomNavigationBar";
import * as React from 'react'






export default function ActivityScreen({navigation}) {
    return (
        <View style={style.container}>
            <View style={style.header}></View>
            <View style={style.body}>
                <Text style={style.date}>Your Activity</Text>
                <Text style={style.text}>Loading</Text>
            </View>
            <BottomNavigationBar navigation={navigation} />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "rgb(97, 53, 188)"
    },
    header: {
        height: 100,
    },
    body: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: "#6240DE",
        fontSize: 20,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 30,
        fontWeight: 'bold',
        // padding: 15,
        color: "#000",
        position: 'absolute',
        top: 20,
        left: 20,
    },
})

