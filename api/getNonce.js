export default async function handler(req, res) {
  try {
    console.log('Checking env vars:', {
      hasConsumerKey: !!process.env.CONSUMER_KEY,
      hasConsumerSecret: !!process.env.CONSUMER_SECRET
    });

    // 先清除舊有session
    const clearSession = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart/clear?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
        }
      }
    );

    // 再攞nonce
    const response = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device',
          'Cookie': clearSession.headers.get('set-cookie')
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
      deviceInfo: req.headers['user-agent']
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
