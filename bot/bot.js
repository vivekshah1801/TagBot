const axios = require("axios").default; // for reco service calls
const { Client, Intents } = require("discord.js");
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}	

// Welcome message to show when this bot is added to a server
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

const BOT_TOKEN = process.env.BOT_TOKEN;
const SERVICE_URL = process.env.SERVICE_URL;

// Creating new discord bot client
const intents = new Intents([
	Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
	"GUILD_MEMBERS", // lets you request guild members
]);	
const client = new Client({ ws: { intents } });
client.login(BOT_TOKEN);

client.on("ready", () => {
	console.log(`${client.user.tag} Online...`);
});

// BOT joined a server
client.on("guildCreate", (guild) => {
	console.log("Server Joined :", guild.name);
	const channel = guild.channels.cache.find(
		(channel) =>
			(channel.name === "general" || channel.name === "welcome") &&
			channel.type === "text" &&
			channel.permissionsFor(guild.me).has("SEND_MESSAGES")
	);
	channel.send(WELCOME_MESSAGE);
});

// BOT removed from a server
client.on("guildDelete", (guild) => {
	console.log("Server Left :", guild.name);
});

// A User joined server
client.on("guildMemberAdd", (member) => {
	console.log("Joined :", member.id);
});

// A User left the server
client.on("guildMemberRemove", (member) => {
	axios
		.delete(get_reco_server_url(messageRef.guild.id) + "/delete", {
			userId: member.id,
			serverId: member.guild.id,
		})
		.then(function (response) {
			messageRef.reply(response.message);
		})
		.catch(function (error) {
			console.log(error);
		});
	console.log("Left :", member.id);
});

// An incoming message in server
client.on("message", async (messageRef) => {
	// ignoring messages sent by a bot.
	if (messageRef.author.bot) return;

	// Status check message
	if (messageRef.content === "!status") {
		axios
			.get(get_reco_server_url(messageRef.guild.id) + "/status")
			.then(function (response) {
				messageRef.channel.send("Bot Status: " + response.data.status);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	// Mapping Status message
	if (messageRef.content === "!mapping") {
		axios
		.get(get_reco_server_url(messageRef.guild.id) + "/check_mapping") //returns mapping servers present only on that reco_server.
		.then(function (response) {
			messageRef.channel.send("Bot mappings: \n" + JSON.stringify(response.data, null, 4));
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	
	// boolean value to know if the bot is tagged in the message or not
	const tagged = messageRef.mentions.users.has(client.user.id);

	// User add to the bot.
	if (tagged && messageRef.content.split(" ").indexOf("!train") !== -1) {
		messageRef.attachments.forEach(async (attachment) => {
			axios
				.post(get_reco_server_url(messageRef.guild.id) + "/add", {
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
	// User remove from the bot
	else if (tagged && messageRef.content.split(" ").indexOf("!removeMyData") !== -1) {
		axios
			.put(get_reco_server_url(messageRef.guild.id) + "/delete", {
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
	// Recognition - Detect and tag faces in the incoming attachment
	else{
		messageRef.attachments.forEach(async (attachment) => {
			// Send image to reco service to get discord ids to tag.
			axios
				.post(get_reco_server_url(messageRef.guild.id) + "/detect", {
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

function get_reco_server_url(serverId){
	// hash the serverId to get a uniform distribution across reco_servers
	// const hash = get_hash(serverId)
	
	// redis lookup
	// redis has mapping of {hash:bot_server_url}
	// const server_url = redis_lookup(hash)
	const server_url = SERVICE_URL
	return server_url
}
