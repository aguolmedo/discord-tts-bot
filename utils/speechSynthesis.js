function textToAudio(text) {

    "use strict";
  
    var sdk = require("microsoft-cognitiveservices-speech-sdk");
  
    const key = "YOUR KEY";
    const region = "REGION DE TU TTS SERVICE";
    const audioFile = "ttsaudio.mp3";
  
  
    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
  
    // Aqui tiene la voz en br, pueden cambiarlo
    speechConfig.speechSynthesisVoiceName = "pt-BR-AntonioNeural"; 
  
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  
    synthesizer.speakTextAsync(text,
        function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you set the speech resource key and region values?");
      }
      synthesizer.close();
      synthesizer = null;      },
        function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null; 
    });
    console.log("Now synthesizing to: " + audioFile);
  }

module.exports = {textToAudio};