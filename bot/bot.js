// imports
if (process.env.NODE_ENV !== "production") {
	// - Checks if environment is profuction or development.
	require("dotenv").config();
}
const axios = require("axios").default;

// new Client instance
const { Client, Intents } = require("discord.js");

//CONFIG
const intents = new Intents([
	Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
	"GUILD_MEMBERS", // lets you request guild members
]);
const client = new Client({ ws: { intents } });


// ENV VARIABLES ----------------------
// bot token from env variable
const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVICE_URL = process.env.SERVICE_URL;

const WELCOME_MESSAGE = `
-----------------------------
**Hello World, I am @TagBot**
-----------------------------

I use Machine Learning to automatically tag people in their images.
So your friends don't miss their funny photo which you sent!

To get Started.
 - Send an image with only your face and tag me (@TagBot) in message-body, so I will remember you.
 - After that, you will be tagged in all images sent with your face in it. 

If you want to remove your data.
 - Simply say "@TagBot !removeMyData"

If you want to check if I am up and running,
 - Simply say "!status"
`;


// login
client.login(BOT_TOKEN);

// ready event
client.on("ready", () => {
	console.log(`${client.user.tag} Online ...`);
});

//BOT joined a server --event
client.on("guildCreate", (guild) => {
	console.log("Joined --- : " + guild.name + " ----");
	const channel = guild.channels.cache.find(
		(channel) =>
			(channel.name === "general" || channel.name === "welcome") &&
			channel.type === "text" &&
			channel.permissionsFor(guild.me).has("SEND_MESSAGES")
	);
	channel.send(WELCOME_MESSAGE);
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

//Delete -----------------------------------------------------
//USER left --event
client.on("guildMemberRemove", (member) => {
	console.log(member.id + " Left");
	// POST-REQUEST /delete
	axios
		.delete(SERVICE_URL + "/delete", {
			userId: member.id,
			serverId: member.guild.id,
		})
		.then(function (response) {
			messageRef.reply(response.message);
		})
		.catch(function (error) {
			console.log(error);
		});
});

// message event
client.on("message", async (messageRef) => {
	// ignore messages sent by a bot.
	if (messageRef.author.bot) return;

	//Status -----------------------------------------------------
	if (messageRef.content === "!status") {
		axios
			.get(SERVICE_URL + "/status")
			.then(function (response) {
				// handle success
				messageRef.channel.send("Bot Status: " + response.data.status);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}

	const tagged = messageRef.mentions.users.has(client.user.id);

	if (messageRef.content === "!mapping") {
		axios
			.get(SERVICE_URL + "/check_mapping")
			.then(function (response) {
				// handle success
				messageRef.channel.send("Bot mappings: \n" + JSON.stringify(response.data, null, 4));
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}

	//ADD -----------------------------------------------------
	if (tagged && messageRef.content.split(" ").indexOf("!train") !== -1) {
		messageRef.attachments.forEach(async (attachment) => {
			// POST-REQUEST /add
			axios
				.post(SERVICE_URL + "/add", {
					userTag: messageRef.author.tag,
					userId: messageRef.author.id,
					serverId: messageRef.guild.id,
					image: attachment.url,
				})
				.then(function (response) {
					messageRef.reply(response.data.message);
				})
				.catch(function (error) {
					console.log(error);
				});
		});
	}

	//removeMyData -----------------------------------------------------
	else if (tagged && messageRef.content.split(" ").indexOf("!removeMyData") !== -1) {
		// PUT-REQUEST /delete
		axios
			.put(SERVICE_URL + "/delete", {
				userId: messageRef.author.id,
				serverId: messageRef.guild.id,
			})
			.then(function (response) {
				messageRef.channel.send(response.data.message);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	else{
		//DETECT -----------------------------------------------------
		messageRef.attachments.forEach(async (attachment) => {
			// POST-REQUEST /detect
			//- send that image to SERVICE to get discord ids to tag.
			axios
				.post(SERVICE_URL + "/detect", {
					userTag: messageRef.author.tag,
					userId: messageRef.author.id,
					serverId: messageRef.guild.id,
					image: attachment.url,
				})
				.then(function (response) {
					let tagMessageBody = "";
					if (response.data.status=="success" && response.data.detected_id.length > 0) {
						response.data.detected_id.forEach(userid=>{
							tagMessageBody += "<@" + userid + "> ";
						})
						messageRef.channel.send("In Photo:\n" + tagMessageBody);
					}
				})
				.catch(function (error) {
					console.log(error);
				});
		});
	}
});
