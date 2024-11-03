export default async function handler(req, res) {
  try {
    console.log('Checking env vars:', {
      hasConsumerKey: !!process.env.CONSUMER_KEY,
      hasConsumerSecret: !!process.env.CONSUMER_SECRET
    });

    // 叫新嘅endpoint
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
