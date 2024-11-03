export default async function handler(req, res) {
  try {
    console.log('Checking env vars:', {
      hasConsumerKey: !!process.env.CONSUMER_KEY,
      hasConsumerSecret: !!process.env.CONSUMER_SECRET
    });

    // 改用新嘅endpoint路徑
    const response = await fetch(
      `https://teaquests.com/wp-json/wc/v3/get-unique-nonce?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`, 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent'] || 'unknown-device'
        }
      }
    );
    
    const data = await response.json();
    
    // 確保有返response data
    if (!data || !data.nonce) {
      throw new Error('Invalid response from WordPress');
    }
    
    res.status(200).json({ 
      nonce: data.nonce,
      session_id: data.session_id,
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
