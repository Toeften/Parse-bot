const Discord = require('discord.js');
const request = require("request")
const Tesseract = require('tesseract.js');
const client = new Discord.Client();
const prefix = "!";
const config = require("./config.json");

const whitelistedGuild = [
	'h',
	'Lana Del Rey',
	'The Senate',
	'Dirkheads',
	'Appellation',
	'LittleHeroes',
	'Nightingale',
	'Garden',
	'booling',
	'Vovicum',
	'Black Bullet'
]
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	const args = message.content.split(" ");
	if (message.content === prefix + "parse") {
		if (message.attachments.size > 0) {
			if (message.attachments.every(attachIsImage)) {
				let image = message.attachments.first();
				let list = {
					notfound: [],
					crasher: [],
					whitelisted: []
				};
				let nicknames = [];
				message.guild.members.forEach(member => {
					nicknames.push(member.displayName);
				})
				let embed = await message.channel.send("Parsing image...");
				function update(list, num) {
					let wait = (num === 100 && "None" || "Please wait...")
					embed.edit("Results! " + num.toFixed(2) + "%", {
						"embed": {
							"color": 16711680,
							"timestamp": new Date(),
							"fields": [{
									"name": `Crashers: (${list.crasher.length})`,
									"value": list.crasher.join(", ") || wait
								},
								{
									"name": `Whitelisted: (${list.whitelisted.length})`,
									"value": list.whitelisted.join(', ') ||  wait
								},
							  {
									"name": `Private Realmeye or Error: (${list.notfound.length})`,
									"value": list.notfound.join(', ') || wait
								}
							],
							"footer": {
								text: 'pog.',
							},
						}
					})
				}
				Tesseract.recognize(
					image.url,
					'eng',
				  ).then(async ({ data: { text } }) => {
					let newtext = text.split("\n").join("")
					let players = newtext.slice(newtext.search(":") + 2).replace(/\s*/g, "").split(",");
					let index = 0;
					players.forEach(async name => {
						function tryagain() {
							request(`http://realmeye-api.herokuapp.com/realmeye-api/?player=${name}&filter=guild`, async function (error, response, body) {
								if (!response || !response.body) {
									tryagain();
									return;
								};
								let playerData = JSON.parse(response.body);
								if (playerData.error) {
									index++;
									list.notfound.push(name);
									return;
								};
								if (whitelistedGuild.includes(playerData.guild) || config.whitelistedPlayer.includes(name) || nicknames.includes(name)) list.whitelisted.push(name);
								else list.crasher.push(name);
								index++;
								update(list, index / players.length * 100);
							  });
						  }
						tryagain();
					})
				});
			}
		} else {
			message.reply("your image?????????").then(e => {
				e.delete(5000)
			})
		}
	}
  if (message.content === prefix + "ping") {
    message.channel.send("Pong!");
  }
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1;
}
client.login(process.env.BOT_TOKEN);
