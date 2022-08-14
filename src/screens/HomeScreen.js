
// import * as React from 'react';
import { StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HomeScreenHeader from "../components/HomeScreenHeader";
import HomeScreenBody from "../components/HomeScreenBody";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { DatabaseConnection } from "../database/database-connection";

var db = DatabaseConnection.getConnection()


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
  

  useEffect(()=> {
    var temp = []
    var today = new Date()
    for (let i = 0; i <= 7; i++) {
      day = new Date(new Date().getTime() + i * (24 * 60 * 60 * 1000))
      d = `${day.getFullYear()}-${makeTwoDigits(day.getMonth()+1)}-${makeTwoDigits(day.getDate())}`
      temp.push({
        dayName: day.toLocaleString('en',{weekday:'short'}),
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
      <HomeScreenBody active={active} navigation={navigation} />
      <BottomNavigationBar navigation={navigation}  />
      <StatusBar />
    </View>
  )
}


const style= StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "rgb(97, 53, 188)",
  }
})



// {headerShown: false}