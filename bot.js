const Discord = require('discord.js');
const fetch = require("node-fetch")
const Tesseract = require('tesseract.js');
const client = new Discord.Client();
const prefix = "!";
const whitelisted = [
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
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.content === prefix + "check") {
		if (message.attachments.size > 0) {
			if (message.attachments.every(attachIsImage)) {
				message.attachments.forEach(async mstAttach => {
                    let list = {
                        notfound: [],
                        crasher: [],
                        whitelisted: []
                    };
                    let embed = await message.channel.send("Please wait...");
                    let update = (list) => {
                        embed.edit("Results!",{
                            "embed": {
                              "color": 16711680,
                              "timestamp": new Date(),
                              "fields": [
                                {
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
					Tesseract.recognize(mstAttach.attachment, 'eng',).then(({data: { text }}) => {
                        let newtext = text.split("\n").join("")
                        let players = newtext.slice(newtext.search(":") + 2).replace(/\s*/g,"").split(",");
                        players.forEach(name => {
                            fetch(`https://nightfirec.at/realmeye-api/?player=${name}`)
                            .then(function(aaa) {
                                return aaa.json();
                              })
                              .then(function(response) {
                                if (response.error) {
                                    console.log(name)
                                    console.log(response.error)
                                    list.notfound.push(name);
                                    return;
                                }
                                if (whitelisted.includes(response.guild)) list.whitelisted.push(name);
                                else list.crasher.push(name);
                                update(list)
                            });
                        })
					})
				})
			}
		} else {
			message.reply("your image?????????")
		}
	}
});

function attachIsImage(msgAttach) {
	var url = msgAttach.url;
	return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1;
}
client.login(process.env.BOT_TOKEN);