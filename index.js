const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;
const TEMPO_AFK = 5 * 60 * 1000; // 5 minutos

const timers = new Map();

client.on("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  const member = newState.member;

  if (!newState.channel) {
    clearTimeout(timers.get(member.id));
    timers.delete(member.id);
    return;
  }

  clearTimeout(timers.get(member.id));

  timers.set(
    member.id,
    setTimeout(async () => {
      try {
        if (member.voice.channel) {
          const canal = member.guild.channels.cache.get(AFK_CHANNEL_ID);
          if (canal) {
            await member.voice.setChannel(canal);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }, TEMPO_AFK)
  );
});

client.login(process.env.TOKEN);
