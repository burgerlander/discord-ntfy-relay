import fetch from 'node-fetch';
import { DiscordClient, MessageDto } from 'discord-gateways';
//your account name here
const userName=`${process.env.DISCORD_USERNAME}`
//ntfy credentials
const ntfyuserName=`${process.env.NTFY_USERNAME}`
const ntfyPassword=`${process.env.NTFY_PASSWORD}`
const TOKEN=`${process.env.DISCORD_TOKEN}`
//your discord token taken from the network tab of your browser
const NTFYURL=`${process.env.NTFY_URL}`
const client = new DiscordClient(`${TOKEN}`);

function doFetch(hasImages, mymessage) {
	if(!hasImages) {
		fetch(`${NTFYURL}`, {
			method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Basic ${Buffer.from(`${ntfyuserName}:${ntfyPassword}`, 'utf8').toString('base64')}`,
		},
		body: `${mymessage.author.global_name} - ${mymessage.content}`,
		})
		.then(response => response.text())
		.then(data => console.log(data))
		.catch(error => console.error(error));
	}
	else
		fetch(`${NTFYURL}`, {
			method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Basic ${Buffer.from(`${ntfyuserName}:${ntfyPassword}`, 'utf8').toString('base64')}`,
		},
		body: `${mymessage.author.global_name} - ${mymessage.content} \(contains images\)`,
		})
		.then(response => response.text())
		.then(data => console.log(data))
		.catch(error => console.error(error));
}


client.on("messageCreate", (message, MessageDto) => {

	const hasImages = (message.attachments.length > 0);
        if(message.mentions.length != 0 )
        {
                message.mentions.forEach(mention => {
                        if(mention.username === userName) {
                                doFetch(hasImages, message);
                        }
                });
        }
        else {
                if(message.channel_type === 1) {
                        if(message.author.username != userName) {
                             doFetch(hasImages, message);
                        }
                }
        }

});

client.connect();
