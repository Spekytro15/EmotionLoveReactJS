import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { GoogleLogo } from "phosphor-react";
import { useEffect, useState } from "react"
import { emotion } from "../service/emojis";
import { UserGlogle, UserTempEmoji, UserTempEmojiP } from "../service/interface";
import {getAuth,signInWithPopup,GoogleAuthProvider,onAuthStateChanged,signOut} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBtSUwWrQkkZVC7uQpkoLnQFCHaYb9mRP4",
  authDomain: "emotionlove-d8e22.firebaseapp.com",
  databaseURL: "https://emotionlove-d8e22-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "emotionlove-d8e22",
  storageBucket: "emotionlove-d8e22.appspot.com",
  messagingSenderId: "833707053431",
  appId: "1:833707053431:web:b7fba1c30f4c17ac3dd172",
  measurementId: "G-LCV6EVCZW5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

export function Home(){
     const [emojiuserU, setemojiU] = useState<UserTempEmoji>()
     const [emojiuserP, setemojiP] = useState<UserTempEmojiP>()
     const [menssagem, setmenssagem] = useState("") 
     const [userparceiro, setuserparceiro] = useState("") 
     
     const [users ,setCadPadrao] = useState<UserGlogle>({
        nome:"anonimo",
        uid: "",
        parceiro: "anonimo1"
      })

    const SingOut = () =>{
      const auth = getAuth();
        signOut(auth).then(() => {
          setCadPadrao({
            nome: "anonimo",
            uid: "",
            parceiro:"anonimo1"
           });  
        }).catch((error) => {
          // An error happened.
        });
    }

     const SignInUser = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    };

      useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser?.displayName) {
      
          setCadPadrao({
            nome: currentUser.displayName,
            uid: currentUser.uid,
            parceiro:userparceiro
           });    
        }
      });
    }, [emojiuserU]);

      const select_emote = (emotion: String, nome: String) => {
         setemojiU({nome:nome, emotion:emotion ,menssagem:""})

         set(ref(database, 'emojitempuser/'+users.uid), {
          nome: nome,
          emotion: emotion,
          menssagem: menssagem,
          parceiro: userparceiro
          
        })
      }

      const getuserParceiro = () =>{
        return onValue(ref(database, 'emojitempuser/' + users.parceiro), (snapshot) => {
          setemojiP({
            nome: snapshot.val().nome,
            emotion: snapshot.val().emotion,
            menssagem: snapshot.val().menssagem
          })
        }, {
          onlyOnce: true
        });
      }
      const getuserUser = () =>{
        return onValue(ref(database, 'emojitempuser/' + users?.uid), (snapshot) => {
          setemojiU({
            nome: snapshot.val().nome,
            emotion: snapshot.val().emotion,
            menssagem: snapshot.val().menssagem
          })
        }, {
          onlyOnce: true
        });
      }

      useEffect(()=>{
        getuserParceiro();
        getuserUser();
      },[emojiuserU])

return ( 
  <div className=" flex   items-center justify-center mt-11"> 
     
         {(()=>{if(users.nome != "anonimo"){
            return (
<div className="flex flex-col w-[400px] rounded-2xl  border-2 border-blue-700 h-[600px] items-center">
  <p className="text-[8pt] ">Seu id :{ String(users?.uid)}</p>
         <input onChange={e => setuserparceiro(e.target.value)} className="rounded  bg-neutral-900 border-2 border-blue-100" type="text" placeholder="Digite ID do seu parceiro"/>
            <div className="flex flex-row mt-1">
        <h1 className="font-sans  mt-8 text-3xl" >{emojiuserP?.nome}</h1>
           </div>
        {// Emoji do parceiro
        emotion.map( (emotion, indice) =>  ( 
              <h1 key={indice} className="font-sans text-[120pt]" >
                          {(() => {
                            if (emotion.emotion == emojiuserP?.emotion) {
                              return (
                                <p>{emotion.emoji}</p>
                              )
                            }else if(emojiuserP?.emotion == ""){
                              return(
                                <h1 className="text-[15pt]">Adicione um parceiro/a</h1>
                              )
                            }
                          })()}
                
                </h1>
          )) }
   
        <p>{emojiuserP?.menssagem ? emojiuserP?.menssagem : "sem declaração"}</p>
   
        <div className="mt-[5vh]">

        {//Emoji user Local
        emotion.map( (emotion, indice) => (
                <button
                key={indice}
                 onClick={() => 
                select_emote(emotion.emotion, users?.nome || "")} 
                className={`text-[${(()=>{if(emojiuserU?.emotion == emotion.emotion){return 35}else{return 20}})()}pt] m-2`}>{emotion.emoji}
                 {(()=>{if(emojiuserU?.emotion == emotion.emotion){
                    return <span className="flex text-[10pt]">{emojiuserU.nome}</span>
                    }else{
                      //  console.log("tests")
                    }})()}
                </button>
          )) }

        </div>
            <div className="justify-center items-center h-3 flex mt-5">

                  <button className="text-slate-400 hover:text-red-400" onClick={()=>SingOut()}>sair</button>

                  <input onChange={e => setmenssagem(e.target.value)} className="p-2 rounded m-3 bg-neutral-900 border-2 border-blue-100" type="text" placeholder="Digite uma menssagem"/>
            </div>       
          </div>
            )
           }else{ 
             return (
             <div className=" flex flex-col items-center justify-center mt-[5vh]">
              <h1 className="text-[120pt]">👀</h1>
              <h1 className="text-[15pt]"><span className="text-green-400">Bem Vindo/a</span>  <span className="text-blue-400">Emotion</span> <span className="text-red-400">Love</span></h1>
               <button className=" mt-8 border-2 border-green-400 p-1 flex justify-center items-center rounded text-green-400 hover:bg-green-800  hover:text-zinc-100" onClick={()=>SignInUser()}><GoogleLogo size={32} color="#6cc67e" weight="fill" /></button>
             </div>)
            }})()}

  </div>
        )
}