// imports
if (process.env.NODE_ENV !== "production") {
  // - Checks if environment is profuction or development.
  require("dotenv").config();
}

// new Client instance
const { Client } = require("discord.js");
const client = new Client();

// bot token from env variable
const BOT_TOKEN = process.env.BOT_TOKEN;

// login
client.login(BOT_TOKEN);

// ready event
client.on("ready", () => {
  console.log(`${client.user.tag} Online ...`);
});

// let guildArray = client.guilds;

//BOT joined a server --event
client.on("guildCreate", (guild) => {
  console.log("Joined --- : " + guild.name + " ----");
  console.log();
  //Your other stuff like adding to guildArray
});

//BOT removed from a server --event
client.on("guildDelete", (guild) => {
  console.log("Left --- : " + guild.name + " ----");
  //remove from guildArray
});

//USER joined --event
client.on("guildMemberAdd", (member) => {
  console.log(member.id + " Joined");
});
//USER left --event
client.on("guildMemberRemove", (member) => {
  console.log(member.id + " Left");
});

// message event
client.on("message", async (messageRef) => {
  // ignore messages sent by a bot.
  if (messageRef.author.bot) return;

  // COMMANDS ---
  // Health Check Test
  if (messageRef.content === "!status") {
    messageRef.channel.send("Bot Status: HEALTHY");
  }

  // Attachment
  messageRef.attachments.forEach(async (attachment) => {
    // DEBUG log
    if (process.env.NODE_ENV !== "production") {
      console.log("[ATTACHMENT] ", attachment);
      //- send that image to SERVICE to get discord ids to tag.
    }
  });
});
