const request = require('request');
const rp = require('request-promise');

async function runMe() {

    let url = 'https://moved.bradi.sh/hello'
    let winning = false;

    do {

        const page =  await rp({method: 'GET', url: url});

        if (page.indexOf('You found me!') !== -1) {
            console.log('Boom...\n' + page);
            winning = true;
        }

        const lines = page.split('\n');
        const nextUuid = lines[(winning ? 7 : 6)].match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/)[1];
        const ts = lines[(winning ? 11 : 7)].match(winning ? /since (.*)</ : /in (.*)</)[1];
        const visitors = lines[(winning ? 12 : 8)].match(/far ([0-9]+) visitor/)[1];
        const steps = lines[(winning ? 13: 9)].match(/takes ([0-9]+) step/)[1];
            
        console.log(`${winning ? 'Trend setting. ' : ''}Step ${steps} achieved ${ts} by ${visitors} visitors at ${nextUuid}`);

        url = `https://moved.bradi.sh/${nextUuid}`        
    } while (true)
}

runMe();



