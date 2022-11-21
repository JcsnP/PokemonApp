
# PokemonApp
Workshop

การนำโปรเจคที่เสร็จสมบูรณ์ไปใช้งาน
 1. ใช้คำสั่ง `clone https://github.com/JcsnP/PokemonApp.git` ใน Terminal
 2. ใช้คำสั่ง `cd PokemonApp` เพื่อเข้าไปยังโฟลเดอร์โปรเจค
 3. ใช้คำสั่ง `npm install` เพื่อติดตั้งแพคเกจ
 4. ใช้คำสั่ง `npx expo start` เพื่อรันโปรเจค

# เริ่มต้นสร้างโปรเจค
<img width="197" alt="image" src="https://user-images.githubusercontent.com/37466531/202900153-e71e4ad9-b056-441c-8207-d84a36a6cad5.png">
โครงสร้างไฟล์และโฟลเดอร์ต่างๆ

## 1. Create a new expo app
`npx create-expo-app PokemonApp`
## 2. Install Packages and Dependencies

**axios**

`npm i axios`
    
**pokemon**

`npm i pokemon`

## 3. Coding
## App.js
```js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,SafeAreaView} from 'react-native';
import Main from './src/Main';

export default function App() {
  return (
    <>
      <StatusBar />
      <Main/>
    </>
  );
}
```

## Main.js
### import แพคเกจ
```js
import { View, Text, TextInput, SafeAreaView, Alert, StyleSheet, ActivityIndicator, Button, placeholder, Image, TouchableOpacity, StatusBar, Keyboard } from 'react-native'
import React, { Component } from 'react';

import pokemon from 'pokemon';
import axios from 'axios';
import Pokemon from './components/Pokemon';

const POKE_API_URL = 'https://pokeapi.co/api/v2';
```

### สร้าง class และ constructor
```js
export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state={
        isLoading:false,
        searchInput:'',
        name:'',
        pic:'',
        types:[],
        desc:'',
    }
  }
  render() {
  
  }
}
```

### สร้างส่วนสำหรับการค้นหาและแสดงผล Pokemon (นำไปใส่ไว้ใน Render)
```js
const{ name,pic,types,desc,searchInput,isLoading } = this.state
return (
    <SafeAreaView style={styles.wrapper}>
       <View style={styles.container}>
       <Image style={styles.image} source={{uri: 'https://user-images.githubusercontent.com/37466531/202855683-08bb0351-2ac9-486c-8424-9e68b8f71ece.png'}} />
            <View style={styles.headContainer}>
                <View style={styles.textInpuTContainer}>
                    <TextInput style={styles.textInput}
                        placeholder='Pokemon Name'
                        onChangeText={(searchInput)=> this.setState({searchInput})}
                        onSubmitEditing={this.searchPokemon}
                        value={this.state.searchInput}
                        clearButtonMode="always"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.searchButton}
                        onPress={this.searchPokemon}
                    >
                        <Text style={{ color: "white", fontWeight: 'bold', fontSize: 19 }}>SEARCH</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.mainContainer}>
                {isLoading && <ActivityIndicator size="large" color="green"/>}

                {!isLoading && (
                    <Pokemon name={name} pic={pic} types={types} desc={desc}/>
                )}
            </View>
       </View>
    </SafeAreaView>
);
```

### สร้างฟังก์ชันสำหรับการค้นหา Pokemon
```js
searchPokemon = async()=>{
    try{
        // ซ่อน keyboard หลังจากผู้ใช้กดปุ่มค้นหา
        Keyboard.dismiss()
        // รับไอดีของโปเกมอนตัวนั้นมาจากชื่อที่กรอกไปใน testInput
        const pokemonID = pokemon.getId((this.state.searchInput.charAt(0).toUpperCase() + this.state.searchInput.slice(1)))

        this.setState({isLoading:true})

        //ยิงget request
        const { data: pokemonData} = await axios.get(`${POKE_API_URL}/pokemon/${pokemonID}`)
        //เข้าถึงApiไปยังpathpokemonละดึงIDมา
        const { data: pokemonSpecieData} = await axios.get(`${POKE_API_URL}/pokemon-species/${pokemonID}`)


        //ดึงข้อมูล DATA
        const { name, sprites, types}= pokemonData
        const { flavor_text_entries }= pokemonSpecieData

        this.setState({
            name,
            pic : sprites.front_default,
            types: this.getTypes(types),
            desc: this.getDescription(flavor_text_entries),
            isLoading: false
        }) 
    }catch(err){
        Alert.alert('ข้อผิดพลาด','ไม่พบข้อมูล POKEMON ดังกล่าว');
    }
}
```

### สร้างฟังก์ชันสำหรับการหาประเภทของ Pokemon
```js
getTypes = (types)=> types.map(({slot,type}) => ({
    id:slot,
    name: type.name
}))
```

### สร้างฟังก์ชันสำหรับการหาคำอธิบายของ Pokemon
```js
getDescription = (entries) => entries.find((item)=>item.language.name === 'en').flavor_text;
```

### ตกแต่งหน้า Main.js
```js
const styles = StyleSheet.create({
    wrapper: {
        flex:1,
    },
    container: {
        flex:1,
        padding:20,
        backgroundColor:'#FFF'
    },
    headContainer:{
        display: 'flex',
        flexDirection:'row',
        marginTop:20,
    },
    textInpuTContainer:{
        flex:2
    },
    buttonContainer:{
        flex:1
    },
    mainContainer:{
        flex:9
    },
    textInput:{
        height:35,
        marginBottom:10,
        borderColor:'#ccc',
        borderWidth:1,
        backgroundColor:'#eaeaea',
        padding:5,
        borderRadius: 7,
    },
    image:{
        width:100,
        height:100,
        alignSelf: 'center'
    },
    searchButton: {
        borderRadius: 5,
        padding: 6,
        backgroundColor: "#3682FF",
        width: "96%",
        alignItems: "center",
        color: "white",
        fontWeight: 'bold',
        marginHorizontal: 4
    },
})
```

## components/Pokemon.js
### import แพคเกจ
```js
import { View, Text , Image,StyleSheet } from 'react-native'
import React from 'react'
```

### สร้างฟังก์ชันสำหรับการแสดงผล Pokemon
```js
export default Pokemon = ({name,pic, types, desc})=>{
    // ทำให้รายละเอียดเปลี่ยนจากหลายบรรทัดเป็นบรรทัดเดียว
    desc = desc.replace(/\n/g, ' ')
    return(
        <View style={styles.mainDetails}>
            <Image style={styles.image} source={{uri: pic.length === 0 ? undefined : pic}} resizeMode="contain" />
            <Text style={styles.name}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
            <View style={styles.typesContainer}>
                {
                types.map((item, key) => (
                    <View style={[styles[item.name],styles.type]} key={key}>
                        <Text style={styles.typeText}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                    </View>
                ))
                }
            </View>
            <View style={styles.description}>
                <Text style={styles.descriptionText}>
                    {desc}
                </Text>
            </View>
        </View>
    );
}
```

### ตกแต่งหน้าสำหรับการแสดงผล Pokemon
```js
//style ตกเเต่งหน้าPokemon
const styles = StyleSheet.create({
    mainDetails:{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    image:{
        marginTop: 10,
        width:210,
        height:210,
        alignSelf: 'center'
    },
    name:{
        fontSize:30,
        fontWeight:'bold',
        textAlign:'center'
    },
    typesContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    type:{
        padding: 5,
        width: '40%',
        alignItems:'center',
        marginVertical: 14,
        borderRadius: 3,
    },
    typeText:{
        color:'white',
        fontWeight:'bold',
        fontSize:20
    },
    description:{
        paddingHorizontal: 30,
        marginTop: 15
    },
    descriptionText: {
        textAlign: 'justify',
        fontSize: 18,
        fontWeight: 'bold',
    },
    normal:{
        backgroundColor:'#A8A878'
    },
    fire:{
        backgroundColor:'#f08030'
    },
    water:{
        backgroundColor:'#6890f0'
    },
    electric:{
        backgroundColor:"#f8d030",
    },
    grass:{
        backgroundColor:'#78c850'
    },
    ice:{
        backgroundColor:'#98d8d8'
    },
    fighting:{
        backgroundColor:'#c03028'
    },
    poison:{
        backgroundColor:'#a04028'
    },
    ground:{
        backgroundColor:'#e9c968'
    },
    flying:{
        backgroundColor:'#a890f0'
    },
    psychic:{
        backgroundColor:'#f85888'
    },
    bug:{
        backgroundColor:'#a85800'
    },
    rock:{
        backgroundColor:'#b8a038'
    },
    ghost:{
        backgroundColor:'#705898'
    },
    dragon:{
        backgroundColor:'#7038f8'
    },
    dark:{
        backgroundColor:'#705848'
    },
    steel:{
        backgroundColor:'#b8b8d0'
    },
    fairy:{
        backgroundColor:'#e898e8'
    }
});
```


# Reference
pokemon-npm
https://www.npmjs.com/package/pokemon

axios-npm
https://www.npmjs.com/package/axios

สอน React Native สร้างแอป Pokemon Search
https://youtu.be/QvkjcWhuHEQ
