export default async function handler(req, res) {
  try {
    const response = await fetch('https://teaquests.com/wp-json/wc/store/v1/cart', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // 改用細楷 'nonce'
    const headers = Object.fromEntries(response.headers);
    const nonce = headers['nonce'];
    
    if (!nonce) {
      return res.status(400).json({ 
        error: 'Nonce not found',
        headers: headers 
      });
    }
    
    res.status(200).json({ nonce });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
