import ccxt from 'ccxt'

export const getWalletBalance = async (event, context, callback) => {
    const { exchange, coin } = event.params.path || { exchange: null, coin: null }

    if (exchange && coin) {
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
    let exchangeObj = null

    switch(exchange) {
        case 'hitbtc': {
            exchangeObj = new ccxt.hitbtc ({
                'apiKey': process.env.hitbtc_api_key,
                'secret': process.env.hitbtc_secret_key,
            })

            break
        }

        case 'binance': {
            exchangeObj = new ccxt.binance ({
                'apiKey': process.env.binance_api_key,
                'secret': process.env.binance_secret_key,
            })

            break
        }

        case 'liqui': {
            exchangeObj = new ccxt.liqui ({
                'apiKey': process.env.liqui_api_key,
                'secret': process.env.liqui_secret_key,
            })

            break
        }

        case 'kucoin': {
            exchangeObj = new ccxt.kucoin ({
                'apiKey': process.env.kucoin_api_key,
                'secret': process.env.kucoin_secret_key,
            })

            break
        }

        default: 
            break
    }

    return exchangeObj
}