export default async function handler(req, res) {
  try {
    const response = await fetch('https://teaquests.com/wp-json/wc/store/v1/cart', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'  // 加入呢行
    });
    
    // 儲存返 cookie
    const cookies = response.headers.get('set-cookie');
    
    const headers = Object.fromEntries(response.headers);
    const nonce = headers['nonce'];
    
    // 將 cookie 同 nonce 一齊返回
    res.status(200).json({ 
      nonce,
      cookies 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
