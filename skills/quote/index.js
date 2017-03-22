const request = require('co-request')
const co = require('co')

co(function * () {
    if ((yield global.db.getSkillValue('quote', 'mashapeapi')) == null) {
        console.log('Setting default API key for Mashape - random quote api')
        yield global.db.setSkillValue('quote', 'mashapeapi', '8sVjx6MmkAmshYIumPQwPUyjQAOMp1U4GCdjsnkpRM6z5wwySw')
    }
})


const intent = () => ({
    keywords: ['Tell me a famous quote', 'Tell me a famous movie quote', 'Tell me a quote by qqqq'],
    module: 'quote'
})

function * quote_resp(query) {
    let type = '',
        mashapeKey = yield global.db.getSkillValue('quote', 'mashapeapi'),
        quote,
        from

    // if a "famous movie quote" or "movie quote" is asked, we return a famous movie quote
    // however, if only a "famous quote" is asked, we return a general famous quote.

    if (query.includes('movie')) {
        type = 'movies'
    } else if (query.includes('famous')) {
        type = 'famous'
    }

    let quote_url = 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=' + type,
        options = {
            url: quote_url,
            headers: {
                'User-Agent': 'P-Brain.ai Quote Skill',
                'X-Mashape-Key': mashapeKey,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            method: 'POST'
        }


    let data = yield request(options)
    data = JSON.parse(data.body)
    quote = data.quote
    from = data.author
    return {text: quote + ' / ' + from}
}


const examples = () => (
    ['Tell me a famous movie quote', 'Tell me a movie quote', 'Tell me a famous quote']
)

module.exports = {
    get: quote_resp,
    intent,
    examples
}
