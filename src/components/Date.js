
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { db } from "../../App";



export default function Date({dayName, dayNumber, taskNumber, isActive, onPressActive, activeDay, index, date}) {
    const [t, setTaskNumber] = React.useState(0)
    db.transaction(function (txn) {
        txn.executeSql(
            'SELECT * FROM tasks WHERE task_date=?',
            [date],
            function (tx, res) {
                // console.log('pppppppppppppppp')
                setTaskNumber(res.rows.length)
            }
        );
    });
    // getTasksNumber = (date) => {
    //     db.transaction(function (txn) {
    //     txn.executeSql(
    //         'SELECT * FROM tasks WHERE task_date=?',
    //         [date],
    //         function (tx, res) {
    //             console.log('pppppppppppppppp')
    //             setTaskNumber(res.rows.length)
    //         }
    //     );
    //     });
    //   }
    
    return (
        <View style={[style.container, index===0 ? {marginLeft: 30} : {marginLeft: 20}]}>
            <Text style={style.dayName}>{dayName}</Text>
            <TouchableOpacity onPress={onPressActive}>
                <View style={[style.div, activeDay == date ? {backgroundColor: "#ffffff", borderRadius: 10} : null]}>
                    <Text style={[style.dayNumber, activeDay == date ? {color: "#000"} : {color: "#fff"}]}>{dayNumber}</Text>
                    <Text style={[style.taskNumber, activeDay == date ? {color: "#000"} : {color: "#fff"}]}>{t} tasks</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    dayName: {
        color: "#fff",
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    div: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 10,
        // backgroundColor: "#fff"
    },
    dayNumber: {
        fontSize: 25,
        // color: "#000",
        fontWeight: 'bold'
    },
    taskNumber: {
        fontSize: 10,
        fontWeight: 'bold'
    }
})





