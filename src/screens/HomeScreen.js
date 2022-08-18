
// import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreenHeader from "../components/HomeScreenHeader";
import HomeScreenBody from "../components/HomeScreenBody";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { DatabaseConnection } from "../database/database-connection";

var db = DatabaseConnection.getConnection()

// let x = Math.abs(date.getTime() - now.getTime())
//         console.log(x)
//         console.log((x-(x%1000)))

//         + 4.5 * 60 * 60 * 1000

export default function HomeScreen({navigation}) {
  function makeTwoDigits (time) {
    const timeString = `${time}`;
    if (timeString.length === 2) return time
    return `0${time}`
  }
  function getTasksNumber(date) {
    return new Promise((resolve, reject) => {
      db.transaction(function (txn) {
        txn.executeSql(
          'SELECT * FROM tasks WHERE task_date=?',
          [date],
          function (tx, res) {
            resolve(res.rows.length)
          }
        );
      });
    })
  }
  const [data, setDates] = useState([])
  const [taskDel, setTaskDel] = useState(false)
  function changeTaskDel() {
    setTaskDel(!taskDel)
  }
  

  useEffect(()=> {
    var temp = []
    for (let i = 0; i <= 7; i++) {
      day = new Date(new Date().getTime() + i * (24 * 60 * 60 * 1000))
      d = `${day.getFullYear()}-${makeTwoDigits(day.getMonth()+1)}-${makeTwoDigits(day.getDate())}`
      temp.push({
        dayName: day.toString().split(' ')[0],
        dayNumber: day.getDate(),
        taskNumber: 0,
        isActive: true,
        date: d
      })
    }
    setDates(temp)
  }, [])
  let now = new Date()
  const [active, setActive] = useState(`${now.getFullYear()}-${makeTwoDigits(now.getMonth()+1)}-${makeTwoDigits(now.getDate())}`)
  return (
    <View style={style.container}>
      <HomeScreenHeader active={active} setActive={setActive} data={data} />
      <HomeScreenBody active={active} navigation={navigation} changeTaskDel={changeTaskDel} taskDel={taskDel} />
      <BottomNavigationBar navigation={navigation}  />
      <StatusBar />
    </View>
  )
}


const style= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(97, 53, 188)",
  }
})



// {headerShown: false}