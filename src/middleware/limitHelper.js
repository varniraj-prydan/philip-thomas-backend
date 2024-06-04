const Product = require('../models/product'); // Adjust the path as needed
const { correctResponse, statusCode, messageResponse } = require('../utils/response');

const checkFeatureLimit = async (req, res, next) => {
  try {
    console.log(req.body.is_featured)
    if (req.body.is_featured == true) {
      const featuredCount = await Product.countDocuments({ is_featured: true });
      if (featuredCount >= 3) {
        // return res.status(400).send({ error: 'Cannot have more than 3 featured products.' });
        return correctResponse({
            res,
            statusCode: statusCode.BAD_REQUEST,
            msg: "Feture product limit finished",
        })
      }
    }
    next();
  } catch (error) {
    return correctResponse({
        res,
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        msg: error,
    })
  }
};

const checkTrendingLimit = async (req, res, next) => {
  try {
    console.log("is_featured---------->"+req.body.is_trending)
    if (req.body.is_trending == true) {
      const trendingCount = await Product.countDocuments({ is_trending: true });
      if (trendingCount >= 3) {
        return res.status(400).send({ error: 'Cannot have more than 3 trending products.'});
      }
    }
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { checkFeatureLimit, checkTrendingLimit };
