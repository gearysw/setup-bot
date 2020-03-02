const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'drink',
    aliases: ['soda', 'sodas'],
    description: 'Keep track of drinks intake and leaderboard',
    args: false,
    easteregg: false,
    usage: 'number || leaderboard',
    execute: async (bot, message, args) => {
        if (!args.length) {
            fs.readFile('./drinks.json', (err, data) => {
                if (err) return console.error(err);
                let json = JSON.parse(data);

                const ID = message.author.id;
                const NAME = (!message.member.nickname) ? message.author.username : message.member.nickname;
                const objIndex = json.findIndex(obj => obj.id === ID);

                if (objIndex === -1) {
                    const trackDrink = {
                        "id": ID,
                        "name": NAME,
                        "drinks": 1
                    };

                    json.push(trackDrink);
                    fs.writeFile('./drinks.json', JSON.stringify(json, null, '\t'), err => {
                        if (err) return console.error(err);
                        const replies = [
                            `${NAME} drowns his sorrows with a drink. He's now tracked 1 drink.`,
                            `${NAME} drinks his sorrows away. He's now taken 1 drink.`,
                            `${NAME} took a swig. He now has 1 drink under his belt.`
                        ];
                        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
                    });
                } else {
                    let Drinks = json[objIndex].drinks + 1;

                    const trackDrink = {
                        "id": ID,
                        "name": NAME,
                        "drinks": parseInt(Drinks)
                    };
                    const updatedDrinks = [
                        ...json.slice(0, objIndex),
                        trackDrink,
                        ...json.slice(objIndex + 1),
                    ];

                    fs.writeFile('./drinks.json', JSON.stringify(updatedDrinks, null, '\t'), err => {
                        if (err) return console.error(err);
                        const replies = [
                            `${NAME} drowns his sorrows with a drink. He's now tracked ${Drinks} drinks.`,
                            `${NAME} drinks his sorrows away. He's now downed ${Drinks} drinks.`,
                            `${NAME} took a swig. He's now had ${Drinks} drinks.`
                        ];
                        message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
                    });
                }
            });
        }
        if (args[0]) {
            if (isNaN(args[0])) {
                if (args[0] === 'leaderboard') {
                    fs.readFile('./drinks.json', (err, data) => {
                        if (err) return console.error(err);
                        const json = JSON.parse(data);
                        if (!json.length) return message.channel.send(`Nobody's tracked their drinks yet. Drink up!`);

                        const sorted = json.slice(0).sort((a, b) => {
                            return b.drinks - a.drinks;
                        });

                        let leaderboard = '';
                        for (const d of sorted) {
                            leaderboard = leaderboard + `${d.drinks} - ${d.name}\n`;
                        }
                        const totalDrinks = sorted.map(s => s.drinks).reduce((a, b) => a + b);

                        const leaderboardEmbed = new Discord.RichEmbed()
                            .setTitle('Drinks Leaderboard')
                            .setDescription(leaderboard)
                            .setColor('#FF5555')
                            .addField('Total Drinks', `CARL has collectively drowned their sorrows with ${totalDrinks} drinks.`);

                        message.channel.send(leaderboardEmbed);
                    });
                } else {
                    fs.readFile('./drinks.json', (err, data) => {
                        if (err) return console.error(err);
                        let json = JSON.parse(data);

                        const ID = message.author.id;
                        const NAME = (!message.member.nickname) ? message.author.username : message.member.nickname;
                        const objIndex = json.findIndex(obj => obj.id === ID);

                        if (objIndex === -1) {
                            const trackDrink = {
                                "id": ID,
                                "name": NAME,
                                "drinks": 1
                            };

                            json.push(trackDrink);
                            fs.writeFile('./drinks.json', JSON.stringify(json, null, '\t'), err => {
                                if (err) return console.error(err);
                                const replies = [
                                    `${NAME} drowns his sorrows with a drink. He's now tracked 1 drink.`,
                                    `${NAME} drinks his sorrows away. He's now taken 1 drink.`,
                                    `${NAME} took a swig. He now has 1 drink under his belt.`
                                ];
                                message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
                            });
                        } else {
                            let Drinks = json[objIndex].drinks + 1;

                            const trackDrink = {
                                "id": ID,
                                "name": NAME,
                                "drinks": parseInt(Drinks)
                            };
                            const updatedDrinks = [
                                ...json.slice(0, objIndex),
                                trackDrink,
                                ...json.slice(objIndex + 1),
                            ];

                            fs.writeFile('./drinks.json', JSON.stringify(updatedDrinks, null, '\t'), err => {
                                if (err) return console.error(err);
                                const replies = [
                                    `${NAME} drowns his sorrows with a drink. He's now tracked ${Drinks} drinks.`,
                                    `${NAME} drinks his sorrows away. He's now downed ${Drinks} drinks.`,
                                    `${NAME} took a swig. He's now had ${Drinks} drinks.`
                                ];
                                message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
                            });
                        }
                    });
                }
            } else if (!isNaN(args[0])) {
                fs.readFile('./drinks.json', (err, data) => {
                    if (err) return console.error(err);
                    let json = JSON.parse(data);

                    const ID = message.author.id;
                    const NAME = (!message.member.nickname) ? message.author.username : message.member.nickname;
                    const objIndex = json.findIndex(obj => obj.id === ID);

                    if (objIndex === -1) {
                        const Drinks = args[0];
                        let reply;

                        if (args[0] <= 0) return message.channel.send(`You can't do that!`);
                        if (args[0] === '1') {
                            reply = [
                                `${NAME} drowns his sorrows with a drink. He's now tracked 1 drink.`,
                                `${NAME} drinks his sorrows away. He's now taken 1 drink.`,
                                `${NAME} took a swig. He now has 1 drink under his belt.`
                            ];
                        } else if (args[0] > 1) {
                            reply = [
                                `${NAME} drowns his sorrows with ${parseInt(args[0])} drinks. He's now tracked ${parseInt(args[0])} drinks.`,
                                `${NAME} drinks his sorrows away with ${parseInt(args[0])} swigs. He's now downed ${parseInt(args[0])} drinks.`,
                                `${NAME} took ${parseInt(args[0])} swigs. He's now had ${parseInt(args[0])} drinks.`
                            ];
                        }

                        const trackDrink = {
                            "id": ID,
                            "name": NAME,
                            "drinks": parseInt(Drinks)
                        };

                        json.push(trackDrink);
                        fs.writeFile('./drinks.json', JSON.stringify(json, null, '\t'), err => {
                            if (err) return console.error(err);
                            message.channel.send(reply[Math.floor(Math.random() * reply.length)]);
                        });
                    } else {
                        let Drinks = json[objIndex].drinks;
                        let reply;

                        if (args[0] <= 0) return message.channel.send(`You can't do that!`);
                        if (args[0] === '1') {
                            Drinks = Drinks + 1;
                            reply = [
                                `${NAME} drowns his sorrows with a drink. He's now tracked ${Drinks} drinks.`,
                                `${NAME} drinks his sorrows away. He's now downed ${Drinks} drinks.`,
                                `${NAME} took a swig. He's now had ${Drinks} drinks.`
                            ];
                        } else if (args[0] > 1) {
                            Drinks = Drinks + parseInt(args[0]);
                            reply = [
                                `${NAME} drowns his sorrows with ${parseInt(args[0])} drinks. He's now tracked ${Drinks} drinks.`,
                                `${NAME} drinks his sorrows away with ${parseInt(args[0])} swigs. He's now downed ${Drinks} drinks.`,
                                `${NAME} took ${parseInt(args[0])} swigs. He's now had ${Drinks} drinks.`
                            ];
                        } else return message.channel.send(`You can't do that!`);

                        const trackDrink = {
                            "id": ID,
                            "name": NAME,
                            "drinks": Drinks
                        };
                        const updatedDrinks = [
                            ...json.slice(0, objIndex),
                            trackDrink,
                            ...json.slice(objIndex + 1),
                        ];

                        fs.writeFile('./drinks.json', JSON.stringify(updatedDrinks, null, '\t'), err => {
                            if (err) return console.error(err);
                            message.channel.send(reply[Math.floor(Math.random() * reply.length)]);
                        });
                    }
                });
            }
        }
    }
}