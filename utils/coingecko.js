const axios = require("axios");

async function get_price(coinid)
{
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + coinid +'&vs_currencies=usd',
  {
    responseType: 'text',
    transformResponse: [v => v]
  });

  const data = await response.data;
  let price = data.toString();
  price = price.replaceAll(/{|}|"|usd/g,'');
  price = price.replaceAll(/:/g,' ');
  
  return price;
}

module.exports = { get_price};