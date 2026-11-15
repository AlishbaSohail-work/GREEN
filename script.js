// --- GREEN: Urdu Voice Fix ---

// Urdu digits -> English digits
function urduDigitsToEnglish(text) {
  if (!text) return "";
  const map = {
    '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4',
    '۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
    '٠':'0','١':'1','٢':'2','٣':'3','٤':'4',
    '٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'
  };
  let out = "";
  for (let ch of text) {
    out += map[ch] || ch;
  }
  return out;
}

// Urdu / Roman words -> Number
function wordToNumber(text) {
  if (!text) return "";
  let t = urduDigitsToEnglish(text.toLowerCase().trim());
  
  const words = {
    'zero': '0', 'sifar': '0', 'sifar': '0', 'صفر': '0',
    'aik': '1', 'ek': '1', 'ایک': '1',
    'do': '2', 'دو': '2',
    'teen': '3', 'تین': '3',
    'char': '4', 'چار': '4',
    'paanch': '5', 'panch': '5', 'پانچ': '5',
    'che': '6', 'chay': '6', 'چھ': '6',
    'saat': '7', 'سات': '7',
    'aath': '8', 'آٹھ': '8',
    'nau': '9', 'نو': '9',
    'das': '10', 'دس': '10'
  };
  
  // agar poora lafz hai to badal do, warna waisa hi rehne do
  if (words[t]) return words[t];
  
  // agar "paanch acre" bola hai to sirf number nikalo
  let onlyDigits = t.replace(/[^0-9.]/g, "");
  if (onlyDigits) return onlyDigits;
  
  for (let w in words) {
    if (t.includes(w)) return words[w];
  }
  return t;
}

// Crop Name: Urdu / Roman -> English (Search ke liye)
function normalizeCrop(text) {
  if (!text) return "";
  let t = urduDigitsToEnglish(text.toLowerCase().trim());

  const crops = {
    'gandum': 'wheat', 'گندم': 'wheat', 'kank': 'wheat',
    'chawal': 'chawal', 'chol': 'chawal', 'چاول': 'chawal',
    'bajra': 'bajra', 'باجرا': 'bajra',
    'makai': 'makai', 'مکئی': 'makai', 'corn': 'makai',
    'kapas': 'cotton', 'کپاس': 'cotton',
    'ganna': 'sugarcane', 'گنا': 'sugarcane',
    'aloo': 'potato', 'آلو': 'potato',
    'pyaz': 'onion', 'پیاز': 'onion',
    'empty': 'empty', 'khali': 'empty', 'خالی': 'empty'
  };
  
  if (crops[t]) return crops[t];
  for (let w in crops) {
    if (t.includes(w)) return crops[w];
  }
  return t;
}