
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Entypo';
import { db } from "../../App";

import PushNotification, {Importance, notifi} from "react-native-push-notification";
// PushNotification.deleteChannel('rf')
// PushNotification.deleteChannel('rfg')
// PushNotification.deleteChannel('rf_luj')


PushNotification.createChannel({
    channelId: "rf_luj", // (required)
    channelName: "My channel", // (required)
//   channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//   importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
},
(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);




export default function Task({props, navigation, changeTaskDel}) {
    const [complete, setComplete] = useState(props.isComplete)
    let changeComplete = () => {
        if (!complete) {
            if (props.alarm_id) {
                PushNotification.cancelLocalNotification(props.alarm_id)
            }
        }
        else {
            if (props.alarmMe) {
                const [year, month, day] = props.date.split('-');
                const [hours, minutes] = props.time.split(':');
                let date = new Date(+year, +month - 1, +day, +hours, +minutes)
                let now = new Date()
                let alarmId = parseInt((now.getTime() - 1660862944637)/1000)
                PushNotification.localNotificationSchedule({
                    id: alarmId,
                    channelId: 'rf_luj',
                    title: props.title,
                    message: "do you your task?", // (required)
                    date: date, // in 60 secs
                    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
                    repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
                    playSound: true,
                });
                let id = props.id
                db.transaction(function (tx) {
                    tx.executeSql(
                        'UPDATE tasks SET alarm_id=? WHERE id=?',
                        [alarmId, id],
                        (t, res) => {
                            console.log('alarm set.')
                        }
                    )
                })
            }
        }
        let id = props.id
        db.transaction(function (txn) {
            txn.executeSql(
                'UPDATE tasks SET is_complete=? WHERE id=?',
                [!complete, id],
                function (tx, res) {
                    setComplete(!complete)
                }
            );
        });
    }
    const [visible, setVisible] = React.useState(false)
    let deleteTask = () => {
        if (props.alarm_id) {
            PushNotification.cancelLocalNotification(props.alarm_id)
        }
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



