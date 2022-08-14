
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";



export default function Date({dayName, dayNumber, taskNumber, isActive, onPressActive, activeDay, index, date}) {
    return (
        <View style={[style.container, index===0 ? {marginLeft: 30} : {marginLeft: 20}]}>
            <Text style={style.dayName}>{dayName}</Text>
            <TouchableOpacity onPress={onPressActive}>
                <View style={[style.div, activeDay == date ? {backgroundColor: "#fff", borderRadius: 10} : null]}>
                    <Text style={[style.dayNumber, activeDay == date ? {color: "#000"} : {color: "#fff"}]}>{dayNumber}</Text>
                    <Text style={[style.taskNumber, activeDay == date ? {color: "#000"} : {color: "#fff"}]}>{taskNumber} tasks</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        // height: 200,
        // width:100,
        alignItems: 'center',
    },
    dayName: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    div: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 10,
        // backgroundColor: "#fff"
    },
    dayNumber: {
        fontSize: 25,
        // color: "#000",
        fontWeight: 'bold'
    },
    taskNumber: {
        fontSize: 10,
        fontWeight: 'bold'
    }
})





