import ccxt from 'ccxt'

export const getWalletBalance = async (event, context, callback) => {
    const pathParams = event.params ? event.params.path : {}
	const { exchange, coin } = pathParams

    if (exchange && coin && ccxt.exchanges.indexOf(exchange) > -1) {
        const response = await get(exchange, coin)

        callback(null, response)
    }

    callback(null, null)
}

const get = async (exchange, coin) => {
    try {
        const exchangeObj = instantiateExchange(exchange)

        if (exchangeObj) {
            let balance = await exchangeObj.fetchBalance()

            if (balance.total) {
                return balance.total[coin]
            }

            if (balance[coin]) {
                return balance[coin]
            }

            return balance
        }

        return null

    } catch (e) {

        if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
            console.log('[DDoS Protection] ' + e.message)
        } else if (e instanceof ccxt.RequestTimeout) {
            console.log('[Request Timeout] ' + e.message)
        } else if (e instanceof ccxt.AuthenticationError) {
            console.log('[Authentication Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            console.log('[Exchange Not Available Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeError) {
            console.log('[Exchange Error] ' + e.message)
        } else if (e instanceof ccxt.NetworkError) {
            console.log('[Network Error] ' + e.message)
        } else {
            throw e;
        }
    }        
}

const instantiateExchange = (exchange) => {
    const apiKeyName = `${exchange}_api_key`
    const secretKeyName = `${exchange}_secret_key`

    return new ccxt[exchange]({ 
        'apiKey': process.env[apiKeyName], 
        'secret': process.env[secretKeyName], 
    })
}