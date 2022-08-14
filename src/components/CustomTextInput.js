
import { StyleSheet, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



export default function CustomTextInput({iconName, placeholerText, }) {
    return (
        <View style={style.container}>
            <FontAwesome style={style.icon} name={iconName} size={15} color={"rgb(125, 125, 125)"} />
            <TextInput placeholder={placeholerText} />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        borderBottomColor: "rgb(188, 224, 253)",
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: 'center'
    },
    icon: {
        paddingRight: 20
    }
})





