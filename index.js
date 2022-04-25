import got from 'got';

async function runMe() {

    let url = 'https://moved.bradi.sh/hello'
    let winning = false;

    do {
        const page = (await got(url, {
            retry: {
                limit: Number.MAX_SAFE_INTEGER,
                calculateDelay: ({computedValue}) => computedValue / 10,
                backoffLimit: 500
            },
            hooks: {
                beforeRetry: [(error, retryCount) => console.log(`Retrying [${retryCount}]: ${error.code}`)]
            }
        })).body.replace(/(\r\n|\n|\r)/gm, '');

        if (page.indexOf('You found me!') !== -1) winning = true;

        const nextUuid = page.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/)[1];
        const ts = page.match(/([0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (A|P)M)/)[1];
        const visitors = page.match(/far ([0-9]+) visitor/)[1];
        const steps = page.match(/takes ([0-9]+) step/)[1];

        console.log(`${winning ? 'One small step for me, one giant leap for https://moved.bradi.sh ' : ''}Step ${steps} achieved ${ts} by ${visitors} visitors at ${nextUuid}`);

        url = `https://moved.bradi.sh/${nextUuid}`          
    } while (true)
}

runMe();



