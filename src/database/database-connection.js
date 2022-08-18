import * as React from 'react'
// import * as SQLite from 'react-native-sqlite-storage';
import {openDatabase} from 'react-native-sqlite-storage'


export const DatabaseConnection = {
  getConnection: () => openDatabase({name: "testDB"}, ()=>{console.log("successful")}, (error)=>{console.log(error)}),
};