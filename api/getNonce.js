export default async function handler(req, res) {
  try {
    const response = await fetch('https://teaquests.com/wp-json/wc/store/v1/cart', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const nonce = response.headers.get('x-wc-store-api-nonce');
    
    res.status(200).json({ nonce });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
