import ccxt from 'ccxt'

export const getWalletBalance = async (event, context, callback) => {
    const response = await get('hitbtc', 'BTC')

	callback(null, response);
}

const get = async (exchange, coin) => {
    let exchangeObj = {}

    try {
        switch(exchange) {
            case 'hitbtc': {
                exchangeObj = new ccxt.hitbtc ({
                    'apiKey': process.env.hitbtc_api_key,
                    'secret': process.env.hitbtc_secret_key,
                })

                let balance = await exchangeObj.fetchBalance()
    
                return balance.total[coin]
            }
            default: 
                return 'Incorrect exchange selected'
        }

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