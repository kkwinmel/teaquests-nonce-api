export default async function handler(req, res) {
  try {
    // 先建立WooCommerce session
    const initSession = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart/items`, 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
        },
        credentials: 'include'
      }
    );

    // 然後再攞nonce
    const response = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device',
          'Cookie': initSession.headers.get('set-cookie') // 用返新session嘅cookie
        },
        credentials: 'include'
      }
    );
    
    const cookies = response.headers.get('set-cookie');
    const headers = Object.fromEntries(response.headers);
    const nonce = headers['nonce'];
    
    res.status(200).json({ 
      nonce,
      cookies,
      deviceId: req.headers['user-agent'] || 'unknown-device'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message
    });
  }
}
