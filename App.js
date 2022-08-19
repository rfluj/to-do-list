
import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen'
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {DatabaseConnection} from "./src/database/database-connection"
import ActivityScreen from './src/screens/ActivityScreen';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);



export const db = DatabaseConnection.getConnection();


const Stack = createNativeStackNavigator();

const MyStack = () => {
  console.log(100000000)
  React.useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS tasks', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, task_title TEXT NOT NULL, task_description TEXT, task_time TEXT NOT NULL, task_date TEXT NOT NULL, is_complete BOOLEAN DEFAULT FALSE NOT NULL, alarm_me BOOLEAN DEFAULT FALSE NOT NULL, alarm_id TEXT )',
              []
            );
          }
        }
      );
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen 
        name="AddTask"
        component={AddTaskScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
          name="Activity"
          component={ActivityScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default MyStack





