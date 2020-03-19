const axios = require('axios');
const fs = require('fs');
const {resolve} = require('path');

const api = 'https://mee6.xyz/api/plugins/levels/leaderboard/230615005194616834?page=';


let players = [];

const run = async () => {
    let currentPage = 0;
    let hasPlayers = true;

    while(hasPlayers) {
        const response = await axios.get(api + currentPage);
        if( !response || response.status !== 200 ) {
            console.log("failed");
            hasPlayers = false;
            return;
        }

        const people = response.data.players;
        if( people.length > 0 ) {
            console.log(`Successfully found ${people.length} players`);
            players = players.concat(people);
            currentPage ++;
        }
        else
            hasPlayers = false;
    }

    fs.writeFileSync(resolve('./data.json'), JSON.stringify(players, null, 4));
    console.log(players.length);
};

run();