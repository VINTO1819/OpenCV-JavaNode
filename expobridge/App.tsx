import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Axios from 'axios'

let cam : Camera | null = null
let running = false
let intervalId: NodeJS.Timeout | null = null

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={
        ref => {
          cam = ref
        }
      }>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if(cam != null){
                if(running){
                  running = false
                  if(intervalId != null) clearInterval(intervalId)
                }else{
                  running = true
                  intervalId = setInterval( async() => {
                    cam!.takePictureAsync({
                      base64:true
                    }).then(img => {
                      
                      Axios({
                        url:'http://10.80.162.199/video',
                        method:'POST',
                        headers:{
                          'Content-Type':'text/plain'
                        },
                        data:img.base64
                      })
                    })
                  }, 1000 / 30)
                }
              }

            }}>
            <Text style={styles.text}> Cap </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
