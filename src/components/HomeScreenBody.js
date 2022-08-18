
import { FlatList, StyleSheet, Text, View } from "react-native";
import Task from "./Task";
import * as React from 'react'
import { db } from "../../App";


export default function HomeScreenBody({navigation, active, changeTaskDel, taskDel}) {
    const [data, setData] = React.useState([])
    const [error, setError] = React.useState(false)
    React.useEffect(()=>{
        db.transaction(function (txn) {
            txn.executeSql(
              'SELECT * FROM tasks WHERE task_date=?',
              [active],
              function (_, {rows}) {
                var temp = [];
                for (let i = 0; i < rows.length; ++i) {
                    temp.push({
                        id: rows.item(i)['id'],
                        time: rows.item(i)['task_time'],
                        title: rows.item(i)['task_title'],
                        description: rows.item(i)['task_description'],
                        isComplete: rows.item(i)['is_complete'],
                        date: rows.item(i)['task_date'],
                        navigation: navigation,
                        alarmMe: rows.item(i)['alarm_me'],
                        alarm_id: rows.item(i)['alarm_id']
                    });
                }
                setData(temp)
              },
              (error)=>{
                setError(error)
              }
            );
        });
    }, [active])
    React.useEffect(()=>{
        db.transaction(function (txn) {
            txn.executeSql(
              'SELECT * FROM tasks WHERE task_date=?',
              [active],
              function (_, {rows}) {
                var temp = [];
                for (let i = 0; i < rows.length; ++i) {
                    temp.push({
                        id: rows.item(i)['id'],
                        time: rows.item(i)['task_time'],
                        title: rows.item(i)['task_title'],
                        description: rows.item(i)['task_description'],
                        isComplete: rows.item(i)['is_complete'],
                        date: rows.item(i)['task_date'],
                        navigation: navigation,
                        alarmMe: rows.item(i)['alarm_me'],
                        alarm_id: rows.item(i)['alarm_id']
                    });
                }
                setData(temp)
              },
              (error)=>{
                setError(error)
              }
            );
        });
    }, [taskDel])
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction(function (txn) {
                txn.executeSql(
                  'SELECT * FROM tasks WHERE task_date=?',
                  [active],
                  function (_, {rows}) {
                    var temp = [];
                    for (let i = 0; i < rows.length; ++i) {
                        temp.push({
                            id: rows.item(i)['id'],
                            time: rows.item(i)['task_time'],
                            title: rows.item(i)['task_title'],
                            description: rows.item(i)['task_description'],
                            isComplete: rows.item(i)['is_complete'],
                            date: rows.item(i)['task_date'],
                            navigation: navigation,
                            alarmMe: rows.item(i)['alarm_me'],
                            alarm_id: rows.item(i)['alarm_id']
                        });
                    }
                    setData(temp)
                  },
                  (error)=>{
                    setError(error)
                  }
                );
              });
          });
        return unsubscribe
      }, [navigation, active]);
    // console.log(active + 'ggggggggggggggggg')
    function makeTwoDigits (time) {
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
      }
    let day = new Date()
    let date  = `${day.getFullYear()}-${makeTwoDigits(day.getMonth()+1)}-${makeTwoDigits(day.getDate())}`
    return (
        <View style={style.container}>
            {error ? <Text>'${error}'</Text> : null}
            <Text style={style.date}>{date == active ? 'Today' : active}</Text>
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <Task props={item} navigation={navigation} changeTaskDel={changeTaskDel} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        flex: 1,
        marginBottom: 80,
        backgroundColor: '#fff'
    },
    date: {
        fontSize: 30,
        fontWeight: 'bold',
        padding: 15,
        color: "#000"
    }
})


