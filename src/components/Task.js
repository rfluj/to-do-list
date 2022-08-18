
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Entypo';
import { db } from "../../App";


export default function Task({props, navigation, changeTaskDel}) {
    const [complete, setComplete] = useState(props.isComplete)
    let changeComplete = () => {
        let id = props.id
        db.transaction(function (txn) {
            txn.executeSql(
                'UPDATE tasks SET is_complete=? WHERE id=?',
                [!complete, id],
                function (tx, res) {
                    // console.log('pppppppppppppppp')
                    setComplete(!complete)
                }
            );
        });
    }
    const [visible, setVisible] = React.useState(false)
    let deleteTask = () => {
        db.transaction((tx) => {
          tx.executeSql(
            'DELETE FROM  tasks where id=?',
            [props.id],
            (tx, results) => {
            //   console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                
                // console.log('task deleted')
                changeTaskDel()
              } else {
                alert('Please insert a valid User Id');
              }
            }
          );
        });
      };
    return (
        <View style={[style.container, style.row]}>
            <View style={[style.timeBox, style.column]}>
                <Text style={style.time}>{props.time}</Text>
                <CheckBox
                    onPress={() => changeComplete()}
                    center
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
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                        <Icon style={style.setting} name="dots-three-vertical" />
                    </TouchableOpacity>
                    {visible ? 
                    <View style={style.menuDiv}>
                        <TouchableOpacity onPress={() => deleteTask()} style={[style.menuOption, {borderTopLeftRadius: 10}]}>
                            <Text style={style.menuText}>delete task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setVisible(false); navigation.navigate('AddTask', {navigation: navigation, alarm_id: props.alarm_id, name: props.title, description: props.description, date: props.date, id: props.id, time: props.time, alarmMee: props.alarmMe})}} style={[style.menuOption, {borderBottomRightRadius: 10, borderBottomLeftRadius: 10,}]}>
                            <Text style={style.menuText}>edit task</Text>
                        </TouchableOpacity>
                    </View>
                    : null}
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
        color: "#000",
        width: 15,
        height: 15,
        // backgroundColor: "#bbb"
    },
    timeBox: {
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000'
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
        color: '#000',
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
    },
    menuDiv: {
        flexDirection: 'column',
        zIndex: 1, 
        width: 100, 
        height: 60, 
        position: 'absolute', 
        right: 18, 
        top: 20, 
    },
    menuOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#eee",
        borderWidth: 1,
        backgroundColor: "rgb(97, 53, 188)",
    },
    menuText: {
        color: '#000'
    }
})



