
import { FlatList, StyleSheet, Text, View } from "react-native";
import Task from "./Task";
import { DatabaseConnection } from "../database/database-connection";
import * as React from 'react'

var db = DatabaseConnection.getConnection()

export default function HomeScreenBody({navigation, active}) {
    const [data, setData] = React.useState([])
    // const [number, setNumber] = React.useState(55)
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction(function (txn) {
                txn.executeSql(
                  "SELECT * FROM tasks",
                  [],
                  function (tx, res) {
                    console.log('item:', res.rows.length);
                    var temp = [];
                    for (let i = 0; i < res.rows.length; ++i) {
                        // setNumber(i+1)
                        temp.push({
                            id: res.rows.item(i)['id'],
                            time: res.rows.item(i)['task_time'],
                            title: res.rows.item(i)['task_title'],
                            description: res.rows.item(i)['task_description'] ? res.rows.item(i)['task_description'] : '',
                            isComplete: res.rows.item(i)['is_complete']
                        });
                    }
                        // setNumber(i)
                    setData(temp)
                    // setNumber(JSON.stringify(temp))
                  //   if (res.rows.length == 0) {
                  //     // txn.executeSql('DROP TABLE IF EXISTS tasks', []);
                  //     txn.executeSql(
                  //       'CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, task_title VARCHAR(100) NOT NULL, task_description TEXT, task_time TEXT NOT NULL, task_date TEXT NOT NULL )',
                  //       []
                  //     );
                  //   }
                  }
                );
              });
          });
        return unsubscribe
      }, [navigation]);
    console.log(active)
    // const data = [
    //     {
    //         id: 1,
    //         time: '11:00',
    //         title: "Angular Training",
    //         description: "َAttend the angular training workshop at Friey`s Space Baner",
    //         isComplete: true
    //     },
    //     {
    //         id: 2,
    //         time: '11:00',
    //         title: "Angular Training",
    //         description: "َAttend the angular training workshop at Friey`s Space Baner",
    //         isComplete: false
    //     },
    //     {
    //         id: 3,
    //         time: '11:00',
    //         title: "Angular Training",
    //         description: "َAttend the angular training workshop at Friey`s Space Baner",
    //         isComplete: false
    //     },
    // ]
    return (
        <View style={style.container}>
            {/* <Text>{number}</Text> */}
            <Text style={style.date}>Today</Text>
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <Task props={item} />
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        // padding:10,
        flex: 1,
        marginBottom: 80,
    },
    date: {
        fontSize: 30,
        fontWeight: 'bold',
        padding: 15
    }
})


