export default async function handler(req, res) {
  try {
    // 首先建立WooCommerce session
    const sessionResponse = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart/items`, 
      {
        method: 'GET',  // 改用GET先建立session
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
        },
        credentials: 'include'
      }
    );

    // 等session建立好先，攞返session cookie
    const sessionCookie = sessionResponse.headers.get('set-cookie');

    // 用新session再攞nonce
    const nonceResponse = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device',
          'Cookie': sessionCookie  // 用返新session嘅cookie
        }
      }
    );
    
    const nonce = nonceResponse.headers['nonce'];
    
    res.status(200).json({ 
      nonce,
      cookies: sessionCookie
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
