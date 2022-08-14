
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Entypo';



export default function Task({props}) {
    const [complete, setComplete] = useState(props.isComplete)
    return (
        <View style={[style.container, style.row]}>
            <View style={[style.timeBox, style.column]}>
                <Text style={style.time}>{props.time}</Text>
                <CheckBox
                    onPress={() => setComplete(!complete)}
                    center
                    // title='Click Here'
                    checkedIcon='check-circle'
                    uncheckedIcon='circle-o'
                    checkedColor="rgb(50, 204, 76)"
                    uncheckedColor="rgb(100, 100, 100)"
                    checked={complete}
                />
            </View>
            <View style={[style.taskBox, style.row]}>
                <View >
                    <Text style={style.title}>{props.title}</Text>
                    <Text numberOfLines={2} style={style.description}>
                        {props.description.length < 70
                            ? `${props.description}`
                            : `${props.description.substring(0, 67)}...`
                        }
                    </Text>
                </View>
                <View style={style.settingBox}>
                    {/* <Text style={style.setting}>setting</Text> */}
                    <Icon style={style.setting} name="dots-three-vertical" />
                    {/* <Text style={style.complete}>Complete</Text> */}
                    {complete ? <Text style={style.complete}>Complete</Text> : null} 
                </View>
            </View>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        height: 100,
        padding: 15,
        paddingLeft: 0,
    },
    row: {
        flexDirection: "row",
    },
    column: {
        flexDirection: 'column',
    },
    body: {
        
    },
    setting: {
        position: 'absolute',
        right: 4,
        top: 10,
    },
    timeBox: {
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    taskBox: {
        flex: 1,
        shadowColor: "black",
        shadowOpacity: 0.1,
        elevation: 3,
        backgroundColor: 'white',
        borderRadius: 5
    },
    title: {
        fontSize: 20,
        paddingLeft: 5,
        // fontWeight: 'bold'
    },
    description: {
        paddingLeft: 5,
        paddingTop: 3,
        color: "rgb(150, 150, 150)"
    },
    complete: {
        backgroundColor: "rgb(50, 204, 76)",
        fontSize: 12,
        color: "#fff",
        fontWeight: "bold",
        position: 'absolute',
        right: 4,
        bottom: 10,
        width: 60,
        textAlign: 'center',
        borderRadius: 5,
        justifyContent: "center"
    },
    settingBox: {
        flex: 1
    }
})



