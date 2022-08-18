
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Date from "./Date";





export default function HomeScreenHeader({active, setActive, data}) {
    return (
        <View style={style.container}>
            <Text style={style.headerText}>Welcome Suhas</Text>
            <FlatList
                data={data}
                renderItem={({ item, index }) => (
                    <Date dayName={item.dayName} dayNumber={item.dayNumber} isActive={item.isActive} date={item.date} activeDay={active} onPressActive={() => setActive(item.date)} index={index} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: 50,
        marginBottom: 30
    },
    headerText: {
        fontSize: 35,
        color: "#fff",
        marginLeft: 30,
        marginBottom: 30
    }
})


