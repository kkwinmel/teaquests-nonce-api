export default async function handler(req, res) {
  try {
    // 保留返log檢查
    console.log('Checking env vars:', {
      hasConsumerKey: !!process.env.CONSUMER_KEY,
      hasConsumerSecret: !!process.env.CONSUMER_SECRET
    });

    // 先建立新session
    const sessionInit = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'POST',  // 用POST嚟建立新session
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
        },
        credentials: 'include',
        body: JSON.stringify({}) // empty body for session init
      }
    );

    // 用新session嘅cookie去攞nonce
    const response = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cookie': sessionInit.headers.get('set-cookie'),
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
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
      deviceInfo: req.headers['user-agent'] // 加入device資訊方便debug
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
