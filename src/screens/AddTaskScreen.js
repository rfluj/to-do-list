
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
import {DatabaseConnection} from "../database/database-connection"






export default function AddTaskScreen({navigation}) {
    var db = DatabaseConnection.getConnection()
    const [alarmMe, setAlarmMe] = useState(false)
    const [taskName, setTaskName] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [taskTime, setTaskTime] = useState('')
    const [choseDate, setChoseDate] = useState(false)
    const [choseTime, setChoseTime] = useState(false)
    const [inputErrors, setInputErrors] = useState({
        nameError: false,
        dateError: false,
        timeError: false,
    })

    function makeTwoDigits (time) {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
      }
    setTime = (event, date) => {
        if (event['type'] === 'dismissed') {
            setChoseTime(false)
        }
        else if (event['type'] === 'set') {
            setTaskTime(`${makeTwoDigits(date.getHours())}:${makeTwoDigits(date.getMinutes())}`)
            obj = inputErrors
            obj['timeError'] = false
            setInputErrors(obj)
            setChoseTime(false)
        }
    };
    setDate = (event, date) => {
        if (event['type'] === 'dismissed') {
            setChoseDate(false)
        }
        else if (event['type'] === 'set') {
            setTaskDate(`${date.getFullYear()}-${makeTwoDigits(date.getMonth()+1)}-${makeTwoDigits(date.getDate())}`)
            obj = inputErrors
            obj['dateError'] = false
            setInputErrors(obj)
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
        if (taskName == '') {
            obj['nameError'] = "* Task Name is empty."
            c += 1
        }
        if (taskDate == '') {
            obj['dateError'] = "* please set task date."
            c += 1
        }
        if (taskTime == '') {
            obj['timeError'] = "* please set task time."
            c += 1
        }
        if (c != 0) {
            setInputErrors(obj)
            return false
        }
        return true
    }
    
    function AddTask() {
        if (checkInputs() === true) {
            Alert.alert('okkkkkk')
            db.transaction(function (tx) {
                tx.executeSql(
                  'INSERT INTO tasks (task_title, task_description, task_time, task_date, alarm_me, is_complete) VALUES (?,?,?,?,?,?)',
                  [taskName, taskDescription, taskTime, taskDate, alarmMe, false],
                  (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
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
                  }
                );
            });
        }
    }
    return(
        <View style={style.container}>
            <View style={style.header}></View>
            {/* <Text>{status}</Text> */}
            <View style={style.form}>
                {/* <Text style={style.text}>{status}</Text> */}
                <Text style={style.text}>Create a new task</Text>
                <View style={style.Input}>
                    <FontAwesome style={[style.icon, {paddingLeft: 5}]} name={'list-ul'} size={15} color={"rgb(125, 125, 125)"} />
                    <TextInput 
                        value={taskName != '' ? taskName : null}
                        style={style.textInputElement} 
                        placeholder={inputErrors['nameError'] ? inputErrors['nameError'] : 'Task Name'}
                        onChangeText={(text)=> setTaskName(text)}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                        placeholderTextColor={inputErrors['nameError'] ? "red" : "#rgb(125, 125, 125)"}
                    />
                </View>
                <View style={style.Input}>
                    <Ionicons style={style.icon} name={'document-text'} size={20} color={"rgb(125, 125, 125)"} />
                    <TextInput 
                        value={taskDescription != '' ? taskDescription : null}
                        style={style.textInputElement} 
                        placeholder={'Task Description'}
                        onChangeText={(text)=> setTaskDescription(text)}
                        ref={(input) => { this.secondTextInput = input; }}
                        placeholderTextColor={"#rgb(125, 125, 125)"}
                    />
                </View>
                <View>
                    <TouchableOpacity style={style.Input} onPress={()=>setChoseDate(true)}>
                        <MaterialIcons style={style.icon} name={'date-range'} size={20} color={"rgb(125, 125, 125)"} />
                        <Text style={[style.textElement, {color: inputErrors['dateError'] ? "red" : taskDate ? "black" : "rgb(125, 125, 125)"}]}>
                            {inputErrors['dateError'] ? inputErrors['dateError'] : taskDate ? taskDate : "Task Date" }
                        </Text>
                    </TouchableOpacity>
                    {choseDate ? <DateTimePicker  themeVariant="dark" mode="date" onChange={this.setDate} value={new Date()} /> : null }
                </View>
                <View>
                    <TouchableOpacity style={style.Input} onPress={()=>setChoseTime(true)}>
                        <MaterialCommunityIcons style={style.icon} name={'alarm-check'} size={20} color={"rgb(125, 125, 125)"} />
                        <Text style={[style.textElement, {color: inputErrors['timeError'] ? "red" : taskTime ? "black" : "rgb(125, 125, 125)"}]}>
                            {taskTime ? taskTime : inputErrors['timeError'] ? inputErrors['timeError'] : "Time" }
                        </Text>
                    </TouchableOpacity>
                    {choseTime ? <DateTimePicker  themeVariant="dark" mode="time" is24Hour={true} onChange={this.setTime} value={new Date()} /> : null }
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
        // fontWeight: 'bold'
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



