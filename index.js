const { AudioPlayerStatus,
        joinVoiceChannel,
        createAudioPlayer,
        createAudioResource 
      } = require('@discordjs/voice');
const Discord = require("discord.js");
const botSettings = require("./botSettings.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES","GUILD_VOICE_STATES"]});

client.on("messageCreate", async (message) => 
{
    const prefix = "!";

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(':')[1];
    const command = commandBody.split(':')[0].toLowerCase();
    
    if (command == "ping") 
    {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`${timeTaken}ms`);
    }

    if (command == "price") 
    {
      //Ejemplo: !price:bitcoin
      const coingecko = require('./utils/coingecko.js');
      const price = await coingecko.get_price(args);
      message.reply(price + ":leafy_green:");
    }

    if (command == "tts")
    {
      //Ejemplo: !tts: meudeus voce muito ruin
      const speechSynthesis = require('./utils/speechSynthesis.js');
      speechSynthesis.textToAudio(args);

      const sleep = require('./utils/sleep')
      await sleep.sleep(1500);

      //Crea el reroductor de audio => DOCS https://discordjs.guide/voice/audio-player
      const player = createAudioPlayer();

      //Crea el objecto que representa la fuente de audio que vamos a reproducir, es un archivo local
      //DOCS https://discordjs.guide/voice/audio-resources
      const resource = createAudioResource('./ttsaudio.mp3');
      
      //El bot se une al canal de voz en el que esta el miembro que ingreso el comando
      //Si no estas conectado a ningun canal de voz al ingresar el comando se rompe todo
      //DOCS https://discordjs.guide/voice/voice-connections
      const connection = joinVoiceChannel ({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      
      //Se subscribe la conexion creada anteriormente al reproductor creado
      //Un reproductor le pasa el stream  audio a todas las conexiones que esten suscritas
      connection.subscribe(player);
      player.play(resource);
      
      //Logs para debuggear el estado del AudioPlayer
      player.on(AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!');
      });
      player.on(AudioPlayerStatus.Idle, () => {
        console.log('The audio player is in initial state!');
      });
      player.on(AudioPlayerStatus.Buffering, () => {
        console.log('The audio player has entered Buffering state!');
      });    
		}
});

client.login(botSettings.BOT_TOKEN);