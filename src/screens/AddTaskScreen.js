
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import BottomNavigationBar from "../components/BottomNavigationBar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState } from "react";
import ToggleSwitch from 'toggle-switch-react-native'
import Icon from 'react-native-vector-icons/Entypo';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from "../../App";

import PushNotification, {Importance, notifi} from "react-native-push-notification";
// PushNotification.deleteChannel('rf')
// PushNotification.deleteChannel('rfg')
// PushNotification.deleteChannel('rf_luj')



PushNotification.createChannel(
    {
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

export default function AddTaskScreen({route, navigation}) {
    const { name, description, date, id, time, alarmMee, alarm_id} = route.params
    const [alarmMe, setAlarmMe] = useState(typeof alarmMee === 'undefined'?false:alarmMee==1?true:false)
    const [taskName, setTaskName] = useState(typeof name === 'undefined'?'':name)
    const [taskDescription, setTaskDescription] = useState(typeof description === 'undefined'?'':description)
    const [taskDate, setTaskDate] = useState(typeof date === 'undefined'?'':date)
    const [taskTime, setTaskTime] = useState(typeof time === 'undefined'?'':time)
    const [choseDate, setChoseDate] = useState(false)
    const [choseTime, setChoseTime] = useState(false)
    const [inputErrors, setInputErrors] = useState({
        nameError: false,
        dateError: false,
        timeError: false,
    })
    function makeTwoDigits(time) {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
      }
    function setTime(event, date) {
        setChoseTime(false)
        if (event['type'] === 'set') {
            setTaskTime(`${makeTwoDigits(date.getHours())}:${makeTwoDigits(date.getMinutes())}`)
            obj = inputErrors
            if (!obj['timeError']) {
                obj['timeError'] = false
                setInputErrors(obj)
            }
        }
    };
    function setDate(event, date) {
        setChoseDate(false)
        if (event['type'] === 'set') {
            setTaskDate(`${date.getFullYear()}-${makeTwoDigits(date.getMonth()+1)}-${makeTwoDigits(date.getDate())}`)
            obj = inputErrors
            if (obj['dateError']) {
                obj['dateError'] = false
                setInputErrors(obj)
            }
            setChoseDate(false)
        }
    };
    function checkInputs() {
        let obj = {
            nameError: false,
            dateError: false,
            timeError: false,
        }
        var c = 0
        if ((typeof taskName === 'undefined') || !(taskName.length > 0)) {
            obj['nameError'] = "* Task Name is empty."
            c += 1
        }
        if ((typeof taskDate === 'undefined') || !(taskDate.length > 0)) {
            obj['dateError'] = "* please set task date."
            c += 1
        }
        if ((typeof taskTime === 'undefined') || !(taskTime.length > 0)) {
            obj['timeError'] = "* please set task time."
            c += 1
        }
        if (c != 0) {
            setInputErrors(obj)
            return false
        }
        return true
    }
    function setNotify() {
        const [year, month, day] = taskDate.split('-');
        const [hours, minutes] = taskTime.split(':');
        let date = new Date(+year, +month - 1, +day, +hours, +minutes)
        let now = new Date()
        let alarmId = parseInt((now.getTime() - 1660862944637)/1000)
        PushNotification.localNotificationSchedule({
            id: alarmId,
            channelId: 'rf_luj',
            title: taskName,
            message: "do you your task?", // (required)
            date: date, // in 60 secs
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
            playSound: true,
        });
        return alarmId
    }
    function AddTask() {
        if (checkInputs() === true) {
            if (!(typeof id === 'undefined') && id > 0) {
                db.transaction(function (tx) {
                    tx.executeSql(
                      'UPDATE tasks SET task_title=?, task_description=?, task_time=?, task_date=?, alarm_me=?, is_complete=? WHERE id=?',
                      [taskName, taskDescription, taskTime, taskDate, alarmMe, alarmMe, id],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                            if (alarmMe) {
                                let alarmId = setNotify()
                                if (alarm_id) {
                                    PushNotification.cancelLocalNotification(alarm_id)
                                }
                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'UPDATE tasks SET alarm_id=? WHERE id=?',
                                        [alarmId, results.insertId],
                                        (t, res) => {
                                            console.log('alarm set.')
                                        }
                                    )
                                })
                            }
                            else {
                                if (alarm_id) {
                                    PushNotification.cancelLocalNotification(alarm_id)
                                }
                            }
                          Alert.alert(
                            'Success',
                            'task created successfully !!!',
                            [
                              {
                                text: 'Ok',
                                onPress: () => navigation.navigate('Home', {navigation: navigation}),
                              },
                            ],
                            { cancelable: false }
                          );
                        } else Alert.alert('Error in set Task. please try again!!!');
                      },
                      (error) => {
                        Alert.alert('Error in set Task. please try again!!!')
                      }
                    );
                });
            }
            else {
                db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO tasks (task_title, task_description, task_time, task_date, alarm_me, is_complete) VALUES (?,?,?,?,?,?)',
                      [taskName, taskDescription, taskTime, taskDate, alarmMe, false],
                      (txx, results) => {
                        if (results.rowsAffected > 0) {
                            if (alarmMe) {
                                let alarmId = setNotify()
                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        'UPDATE tasks SET alarm_id=? WHERE id=?',
                                        [alarmId, results.insertId],
                                        (t, res) => {
                                            console.log('alarm set.')
                                        }
                                    )
                                })
                            }
                          Alert.alert(
                            'Success',
                            'task created successfully !!!',
                            [
                              {
                                text: 'Ok',
                                onPress: () => navigation.navigate('Home', {navigation: navigation}),
                              },
                            ],
                            { cancelable: false }
                          );
                        } else Alert.alert('Error in set Task. please try again!!!');
                      },
                      (error) => {
                        console.log(error)
                    }
                    );
                });
            }
        }
    }
    return(
        <View style={style.container}>
            <View style={style.header}></View>
            <View style={style.form}>
                <Text style={style.text}>Create a new task</Text>
                <View style={style.Input}>
                    <FontAwesome style={[style.icon, {paddingLeft: 5}]} name={'list-ul'} size={15} color={"rgb(125, 125, 125)"} />
                    <TextInput 
                        color={"#000"}
                        value={taskName != '' ? taskName : null}
                        style={style.textInputElement} 
                        onChangeText={(text)=> setTaskName(text)}
                        placeholder={inputErrors['nameError'] ? inputErrors['nameError'] : 'Task Name'}
                        blurOnSubmit={false}
                        placeholderTextColor={inputErrors['nameError'] ? "red" : "#rgb(125, 125, 125)"}
                    />
                </View>
                <View style={style.Input}>
                    <Ionicons style={style.icon} name={'document-text'} size={20} color={"rgb(125, 125, 125)"} />
                    <TextInput 
                        color={"#000"}
                        value={taskDescription != '' ? taskDescription : null}
                        style={style.textInputElement} 
                        placeholder={'Task Description'}
                        onChangeText={(text)=> setTaskDescription(text)}
                        placeholderTextColor={"#rgb(125, 125, 125)"}
                    />
                </View>
                <View>
                    <TouchableOpacity style={style.Input} onPress={()=>setChoseDate(true)}>
                        <MaterialIcons style={style.icon} name={'date-range'} size={20} color={"rgb(125, 125, 125)"} />
                        <Text style={[style.textElement, {color: taskDate ? "black": inputErrors['dateError'] ? "red" : "rgb(125, 125, 125)"}]}>
                            {taskDate? taskDate :inputErrors['dateError'] ? inputErrors['dateError'] : "Task Date" }
                        </Text>
                    </TouchableOpacity>
                    {choseDate ? <DateTimePicker  themeVariant="dark" mode="date" onChange={(event, date) => setDate(event, date)} value={new Date()} /> : null }
                </View>
                <View>
                    <TouchableOpacity style={style.Input} onPress={()=>setChoseTime(true)}>
                        <MaterialCommunityIcons style={style.icon} name={'alarm-check'} size={20} color={"rgb(125, 125, 125)"} />
                        <Text style={[style.textElement, {color: taskTime ? "black": inputErrors['timeError'] ? "red" : "rgb(125, 125, 125)"}]}>
                            {taskTime ? taskTime : inputErrors['timeError'] ? inputErrors['timeError'] : "Time" }
                        </Text>
                    </TouchableOpacity>
                    {choseTime ? <DateTimePicker  themeVariant="dark" mode="time" is24Hour={true} onChange={(event, date) => setTime(event, date)} value={new Date()} /> : null }
                </View>
                <View style={[style.Input, {borderBottomWidth: 0}]}>
                    <Text style={style.alarmText}>Notify Me</Text>
                    <ToggleSwitch
                        style={style.toggle}
                        isOn={alarmMe}
                        onColor="rgb(97, 53, 188)"
                        offColor="#fff"
                        thumbOffStyle={{backgroundColor: "rgb(97, 53, 188)"}}
                        trackOffStyle={{borderWidth: 1, borderColor: "rgb(97, 53, 188)"}}
                        onToggle={() => setAlarmMe(!alarmMe)}
                    />
                </View>
                <View style={style.addView}>
                    <TouchableOpacity onPress={() => AddTask()} style={style.addButton}>
                        <Icon name="plus" color={"#fff"} size={25} style={style.addButtonIcon}/>
                        <Text style={style.addButtonText}>Add Task</Text>
                    </TouchableOpacity>
                </View>
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
    form: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    text: {
        marginTop: 20,
        marginLeft: 20,
        fontSize: 35,
        marginBottom: 10,
        color: "#000"
    },
    Input: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: "rgb(188, 224, 253)",
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        marginRight: 20
    },
    textInputElement: {
        flex: 1,
    },
    alarmText: {
        fontSize: 17,
        paddingLeft: 10,
        color: "rgb(125, 125, 125)",
    },
    toggle: {
        position: "absolute",
        right: 0
    },
    addView: {
        height: 100,
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
    },
    addButton: {
        flexDirection: 'row',
        borderRadius: 40,
        backgroundColor: "rgb(97, 53, 188)",
        height: 70,
        justifyContent: "center",
        alignItems: 'center',
    },
    addButtonIcon: {
        paddingRight: 10
    },
    addButtonText: {
        fontSize: 22,
        color: "#fff",
        fontWeight: 'bold'
    },
    textElement: {
        flex: 1,
        color: "rgb(125, 125, 125)",
    }
})

