export default async function handler(req, res) {
  try {
    // 打印 environment variables 嚟確認有冇讀到
    console.log('Checking env vars:', {
      hasConsumerKey: !!process.env.CONSUMER_KEY,
      hasConsumerSecret: !!process.env.CONSUMER_SECRET
    });

    const response = await fetch(
      `https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    );
    
    const cookies = response.headers.get('set-cookie');
    const headers = Object.fromEntries(response.headers);
    const nonce = headers['nonce'];
    
    res.status(200).json({ 
      nonce,
      cookies 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}
