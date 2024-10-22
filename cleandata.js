const fs = require('fs');
const path = require('path');

// ฟังก์ชันสำหรับทำความสะอาดข้อมูลที่ไม่จำเป็น
const cleanText = (text) => {
  if (text) {
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{02702}-\u{027B0}\u{024C2}-\u{1F251}]/gu, ''); // ลบอิโมจิ
    text = text.replace(/-/g, '').trim();
  }
  return text || '-';
};

// ฟังก์ชันสำหรับแปลงข้อมูลที่เป็นราคาให้อยู่ในรูปแบบที่เป็นตัวเลข
const parsePrice = (priceStr) => {
  if (priceStr && typeof priceStr === 'string') {
    priceStr = priceStr.replace(/[\,฿]/g, '');
    priceStr = priceStr.match(/\d+\.\d+|\d+/) ? priceStr.match(/\d+\.\d+|\d+/)[0] : '';
    try {
      return parseFloat(priceStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

// ฟังก์ชันสำหรับทำความสะอาดข้อมูลตลาด
const cleanMarketData = (market) => {
  const cleanedMarket = {
    marketName: cleanText(market.marketName),
    marketRating: cleanText(market.marketRating),
    marketAddress: cleanText(market.marketAddress),
    marketPrice: parsePrice(market.marketPrice),
    urlimageProfile: market.urlimageProfile || '-',
    linkDetail: market.linkDetail || '-',
    detailMarket: []
  };

  // ทำความสะอาดข้อมูลรายละเอียดตลาด
  for (const detail of market.detailMarket || []) {
    const cleanedDetail = {
      marketDetail: cleanText(detail.marketDetail),
      ratingDetail: cleanText(detail.ratingDetail),
      addressDetail: cleanText(detail.addressDetail),
      googleMapLink: detail.googleMapLink || '-',
      typeOfShops: (detail.typeOfShops || []).map(shop => cleanText(shop)),
      marketHighlights: (detail.marketHighlights || []).map(highlight => cleanText(highlight)).filter(Boolean),
      additionalInfo: Object.fromEntries(
        Object.entries(detail.additionalInfo || {}).map(([key, value]) => [key, cleanText(value)])
      ),
      detailMarket: {
        textContent: (detail.detailMarket.textContent || []).map(text => cleanText(text)).join('\n'),
        imageSrcs: detail.detailMarket.imageSrcs || []
      },
      nearbyPlaces: (detail.nearbyPlaces || []).map(place => cleanText(place)),
      marketContract: Object.fromEntries(
        Object.entries(detail.marketContract || {}).map(([key, value]) => [key, cleanText(value)])
      ),
      imageMarket: detail.imageMarket || []
    };
    cleanedMarket.detailMarket.push(cleanedDetail);
  }

  // ทำความสะอาดข้อมูลแผงที่ว่าง
  cleanedMarket.Emptypanel = (market.Emptypanel || []).map(panel => ({
    stallNumber: cleanText(panel.stallNumber),
    zone: cleanText(panel.zone),
    areaType: cleanText(panel.areaType),
    size: cleanText(panel.size),
    price: parsePrice(panel.price),
    discountText: cleanText(panel.discountText),
    originalPrice: parsePrice(panel.originalPrice),
    discountedPrice: parsePrice(panel.discountedPrice),
    imageUrl: panel.imageUrl || '-'
  }));

  return cleanedMarket;
};

// โหลดข้อมูลจากไฟล์ JSON
const inputFilePath = path.join(__dirname, 'data', 'DataThaiMarket.json');
const outputFilePath = path.join(__dirname, 'data', 'cleanedDataMarket.json');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const markets = JSON.parse(data);

  // ทำความสะอาดข้อมูลทั้งหมด
  const cleanedData = markets.map(cleanMarketData);

  // บันทึกข้อมูลที่ทำความสะอาดแล้วไปยังไฟล์ JSON ใหม่
  fs.writeFile(outputFilePath, JSON.stringify(cleanedData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Data cleaned and saved to', outputFilePath);
  });
});
