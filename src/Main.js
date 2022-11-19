import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    Alert,
    StyleSheet,
    ActivityIndicator,
    Button,
    placeholder,
    Image,
    TouchableOpacity,
    StatusBar
} from 'react-native'
import React, { Component } from 'react';

import pokemon from 'pokemon';
import axios from 'axios';
import Pokemon from './components/Pokemon';

const POKE_API_URL = 'https://pokeapi.co/api/v2';

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
        const{ name,pic,types,desc,searchInput,isLoading } = this.state
        return (       
            <SafeAreaView style={styles.wrapper}>
               <View style={styles.container}>
               <Image style={styles.image} source={require('../assets/poke.png')} />
                    <View style={styles.headContainer}>
                        <View style={styles.textInpuTContainer}>
                            <TextInput style={styles.textInput}
                                placeholder='PokemonName '
                                onChangeText={(searchInput)=> this.setState({searchInput})}
                                value={this.state.searchInput}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.loginBtn}
                                onPress={this.searchPokemon}
                            >
                            <Text style={{ color: "white", fontWeight: 'bold', fontSize: 19 }}>SEARCH</Text>
                            </TouchableOpacity>
                            {/* <Button 
                            title='Search'
                            color='black'
                            // color='#0064e1'
                            onPress={this.searchPokemon}
                            /> */}
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        
                        {isLoading && <ActivityIndicator size="large" color="green"/>}

                        {!isLoading &&(
                            <Pokemon name={name} pic={pic} types={types} desc={desc}/>
                        )}
                    </View>
               </View>
            </SafeAreaView>

        );

    }
    searchPokemon = async()=>{
        try{
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
                types:this.getTypes(types),
                desc:this.getDescription(flavor_text_entries),
                isLoading:false
            })
            
        }catch(err){
            Alert.alert('ข้อผิดพลาด','ไม่พบข้อมูล POKEMON ดังกล่าว');
        }
    }
    //สร้างfunctiongetType
    //รับค่าparameter
    getTypes = (types)=> types.map(({slot,type}) => ({
            id:slot,
            name: type.name
        }))
    

    //function description
    getDescription = (entries) =>
        entries.find((item)=>item.language.name === 'en').flavor_text;
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1
    },
    container:{
        flex:1,
        padding:20,
        backgroundColor:'#FFF'
    },
    headContainer:{
        flex:1,
        flexDirection:'row',
        marginTop:20
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
        borderRadius:10
    },
    image:{
        width:100,
        height:100,
        left:130,
        alignItems:'center',
        marginTop:10
    },loginBtn: {
        borderWidth: 0,
        borderRadius: 20,
        padding: 10,
        backgroundColor: "#BF1700",
        width: "80%",
        alignItems: "center",
        color: "white",
        fontWeight: 'bold',
        marginBottom:10,
        left:10,
        bottom:2
        
      },

})
