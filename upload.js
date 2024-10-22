const fs = require("fs");
const path = require("path");
const { sql, connectToDatabase } = require("./db");


const filePath = path.join(__dirname, "data", "cleanedDataMarket.json");

// อ่านไฟล์ JSON
fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

  try {
    const markets = JSON.parse(data);
    // เชื่อมต่อฐานข้อมูล
    // await sql.connect(config);
    await connectToDatabase();

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง Market
    const insertMarket = async (market) => {
      try {
        const result = await sql.query`
          INSERT INTO Market (MarketName, MarketRating, MarketAddress, MarketPrice, UrlImageProfile, LinkDetail)
          VALUES (${market.marketName}, ${market.marketRating}, ${market.marketAddress}, ${market.marketPrice}, ${market.urlimageProfile}, ${market.linkDetail})
          SELECT SCOPE_IDENTITY() AS MarketId
        `;
        return result.recordset[0].MarketId;
      } catch (error) {
        console.error("Error inserting market:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง DetailMarket
    const insertDetailMarket = async (marketId, detailMarket) => {
      try {
        const result = await sql.query`
          INSERT INTO DetailMarket (MarketId, MarketDetail, RatingDetail, AddressDetail, GoogleMapLink)
          VALUES (${marketId}, ${detailMarket.marketDetail}, ${detailMarket.ratingDetail}, ${detailMarket.addressDetail}, ${detailMarket.googleMapLink})
          SELECT SCOPE_IDENTITY() AS DetailMarketId
        `;
        return result.recordset[0].DetailMarketId;
      } catch (error) {
        console.error("Error inserting detail market:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง TypeOfShops
    const insertTypeOfShops = async (detailMarketId, typeOfShop) => {
      try {
        await sql.query`
          INSERT INTO TypeOfShops (DetailMarketId, TypeOfShop)
          VALUES (${detailMarketId}, ${typeOfShop})
        `;
      } catch (error) {
        console.error("Error inserting type of shop:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง MarketHighlights
    const insertMarketHighlights = async (detailMarketId, highlight) => {
      try {
        await sql.query`
          INSERT INTO MarketHighlights (DetailMarketId, Highlight)
          VALUES (${detailMarketId}, ${highlight})
        `;
      } catch (error) {
        console.error("Error inserting market highlight:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง AdditionalInfo
    const insertAdditionalInfo = async (detailMarketId, additionalInfo) => {
      try {
        await sql.query`
          INSERT INTO AdditionalInfo (DetailMarketId, PriceRange, AreaSize, AvailableSpaces, ParkingSpots, Toilets, OperationTime, Transportation, VendorNotes)
          VALUES (${detailMarketId}, ${additionalInfo.priceRange}, ${additionalInfo.areaSize}, ${additionalInfo.availableSpaces}, ${additionalInfo.parkingSpots}, ${additionalInfo.toilets}, ${additionalInfo.operationTime}, ${additionalInfo.transportation}, ${additionalInfo.vendorNotes})
        `;
      } catch (error) {
        console.error("Error inserting additional info:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง NearbyPlaces
    const insertNearbyPlaces = async (detailMarketId, nearbyPlace) => {
      try {
        await sql.query`
          INSERT INTO NearbyPlaces (DetailMarketId, NearbyPlace)
          VALUES (${detailMarketId}, ${nearbyPlace})
        `;
      } catch (error) {
        console.error("Error inserting nearby place:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง MarketContract
    const insertMarketContract = async (detailMarketId, marketContract) => {
      try {
        await sql.query`
          INSERT INTO MarketContract (DetailMarketId, ContractPrice, Note, InitialCost, InsurancePremium, AdvanceRent, WaterFee, ElectricityBill, OtherExpenses, Total)
          VALUES (${detailMarketId}, ${marketContract.contractPrice}, ${marketContract.note}, ${marketContract.initialCost}, ${marketContract.insurancePremium}, ${marketContract.advanceRent}, ${marketContract.waterFee}, ${marketContract.electricityBill}, ${marketContract.otherExpenses}, ${marketContract.total})
        `;
      } catch (error) {
        console.error("Error inserting market contract:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง ImageMarket
    const insertImageMarket = async (detailMarketId, imageUrl) => {
      try {
        await sql.query`
          INSERT INTO ImageMarket (DetailMarketId, ImageUrl)
          VALUES (${detailMarketId}, ${imageUrl})
        `;
      } catch (error) {
        console.error("Error inserting image market:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง DetailMarketTextContent
    const insertDetailMarketTextContent = async (
      detailMarketId,
      textContent
    ) => {
      try {
        await sql.query`
          INSERT INTO DetailMarketTextTextContent (DetailMarketId, TextContent)
          VALUES (${detailMarketId}, ${textContent})
        `;
      } catch (error) {
        console.error("Error inserting detail market text content:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูล base64 ลงในตาราง DetailMarketTextContent
    const insertDetailMarketImageSrcs = async (detailMarketId, imageSrcs) => {
      try {
        for (const imageSrc of imageSrcs) {
          await sql.query`
            INSERT INTO DetailMarketTextTextContent (DetailMarketId, TextContent)
            VALUES (${detailMarketId}, ${imageSrc})
          `;
        }
      } catch (error) {
        console.error("Error inserting detail market image srcs:", error);
        throw error;
      }
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลลงในตาราง EmptyPanel
    const insertEmptyPanel = async (marketId, emptyPanel) => {
      try {
        await sql.query`
          INSERT INTO EmptyPanel (MarketId, StallNumber, Zone, AreaType, Size, Price, DiscountText, OriginalPrice, DiscountedPrice, ImageUrl)
          VALUES (${marketId}, ${emptyPanel.stallNumber}, ${emptyPanel.zone}, ${emptyPanel.areaType}, ${emptyPanel.size}, ${emptyPanel.price}, ${emptyPanel.discountText}, ${emptyPanel.originalPrice}, ${emptyPanel.discountedPrice}, ${emptyPanel.imageUrl})
        `;
      } catch (error) {
        console.error("Error inserting empty panel:", error);
        throw error;
      }
    };

    // บันทึกข้อมูลทีละตลาดลงในฐานข้อมูล
    for (const market of markets) {
      try {
        const marketId = await insertMarket(market);
        console.log(
          `Inserted market with name: ${market.marketName}, ID: ${marketId}`
        );

        for (const detailMarket of market.detailMarket) {
          const detailMarketId = await insertDetailMarket(
            marketId,
            detailMarket
          );
          console.log(`Inserted detail market with ID: ${detailMarketId}`);

          for (const typeOfShop of detailMarket.typeOfShops) {
            await insertTypeOfShops(detailMarketId, typeOfShop);
          }

          for (const highlight of detailMarket.marketHighlights) {
            await insertMarketHighlights(detailMarketId, highlight);
          }

          await insertAdditionalInfo(
            detailMarketId,
            detailMarket.additionalInfo
          );

          for (const nearbyPlace of detailMarket.nearbyPlaces) {
            await insertNearbyPlaces(detailMarketId, nearbyPlace);
          }

          await insertMarketContract(
            detailMarketId,
            detailMarket.marketContract
          );

          for (const imageUrl of detailMarket.imageMarket) {
            await insertImageMarket(detailMarketId, imageUrl);
          }

          await insertDetailMarketTextContent(
            detailMarketId,
            detailMarket.detailMarket.textContent
          );
          await insertDetailMarketImageSrcs(
            detailMarketId,
            detailMarket.detailMarket.imageSrcs
          );
        }

        for (const emptyPanel of market.Emptypanel) {
          await insertEmptyPanel(marketId, emptyPanel);
        }
      } catch (error) {
        console.error(
          `Failed to insert market with name: ${market.marketName}`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // ปิดการเชื่อมต่อฐานข้อมูล
    await sql.close();
    console.log("Database connection closed");
  }
});
