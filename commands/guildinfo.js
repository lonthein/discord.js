const request = require('request');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pinfo')
        .setDescription('Provides information about the player.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the player')
                .setRequired(true)),

    async execute(interaction) {
        const playerName = interaction.options.getString('name');
        const playerEmbed = await getPlayerInfo(playerName);
        await interaction.reply({ embeds: [playerEmbed] });
    },
};

function getPlayerInfo(playerName) {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://gameinfo.albiononline.com/api/gameinfo/search?q=${playerName}`;

        request(apiUrl, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const data = JSON.parse(body);
                const playerId = data.players[0].Id;
                const guildName = data.players[0].GuildName;
                const killFame = data.players[0].KillFame;
                console.log(`Player ID: ${playerId}, Guild Name: ${guildName}`);

                const playerEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Player Information')
                    .addFields(
                        { name: 'Name', value: playerName.toString() },
                        { name: 'Gilde', value: guildName.toString() },
                        { name: 'Kill Fame', value: killFame.toString() },
                    )
                    .setTimestamp();

                resolve(playerEmbed);
            }
            else {
                reject(error);
            }
        });
    });
}
