export default async function handler(req, res) {
  try {
    const response = await fetch('https://teaquests.com/wp-json/wc/store/v1/cart?consumer_key=ck_faf6e983fe22bdbf14cef66483891058dcaf17c0&consumer_secret=cs_f41ecc320c623f095ef2da62e2af83f353359136', {
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
