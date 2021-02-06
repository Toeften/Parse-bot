const Discord = require('discord.js');
const request = require("request")
const Tesseract = require('tesseract.js');
const client = new Discord.Client();
const prefix = "!";
const whitelistedPlayer = [
    "Nude",
    "AetheA",
    "Maginallll",
    "Jukkii",
    "OnePieceVK",
    "Phoezflm",
    "Madlabrush",
    "Linn",
    "ThatsJake",
    "ZBVTTX",
    "RedasKG",
    "Toften",
    "Floflorian",
    "KUNiBALD",
	"itachiToT",
	"baes",
	"Kreszczi",
	'Popestar',
	"Manaphy",
	"Andreasan",
	"Jimx",
	"Lillie",
	"Cubeee",
	"Baanana",
	"Bocas",
	"Murrin",
	"BalaHU",
	"Gravesbud",
	"MaxFelon",
	"Maximumlhp",
	"Xoo",
	"IchBinDein",
	"Trbc",
	"Mosasank",
	"Idyll",
	"Eithanhugs",
	"Eksemie",
	"qq",
	"Orb",
	"GangDuck",
	"Qweik",
	"ItzKieron",
	"Deltrex",
	"MOONSHOOT"
];

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
	'Vovicum'
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
				let embed = await message.channel.send("Parsing image...");
				function update(list, num) {
					embed.edit("Results! " + num.toFixed(2) + "%", {
						"embed": {
							"color": 16711680,
							"timestamp": new Date(),
							"fields": [{
									"name": "Crashers",
									"value": list.crasher.join(", ") || "Please wait..."
								},
								{
									"name": "Whitelisted",
									"value": list.whitelisted.join(', ') || "Please wait..."
								},
							  {
									"name": "Private Realmeye or Error",
									"value": list.notfound.join(', ') || "Please wait..."
								}
							],
							"footer": {
								text: 'this isnt 100% accurate but might help alot.',
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
						let retries = 0;
						  function tryagain() {
							request(`http://realmeye-api.herokuapp.com/realmeye-api/?player=${name}&filter=guild`, async function (error, response, body) {
								  if (!response || !response.body) {
									  tryagain();
									  return;
								  };
								  let playerData = JSON.parse(response.body);
								  if (playerData.error) {
									if (retries >= (args[1] || 5)) {
										index++;
										list.notfound.push(name);
										return;
									};
									retries++;
									await sleep(10);
									tryagain();
									return;
								  }
								  if (whitelistedGuild.includes(playerData.guild) || whitelistedPlayer.includes(name)) list.whitelisted.push(name);
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
