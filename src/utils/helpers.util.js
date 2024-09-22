/**
 * @license Apache-2.0
 * @copyright JosePM 2024
 */

"use strict";

/**
 * custom modules
 */
const apiConfig = require("../config/api.config");

/**
 * Generates a random string containing numbers and letters
 * @param {number} length The length of the string
 * @returns {string} Generated string
 */

const generateRandomString = function (length) {
  let /** {string | undefined} */ randomString = "";
  const /** {string} */ possibleLetters =
      "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ0123456789";
  for (let i = 0; i < length - 1; i++) {
    const /** {number} */ randomIndex = Math.floor(
        Math.random() * possibleLetters.length
      );
    randomString += possibleLetters[randomIndex];
  }
  return randomString;
};

/**
 * Constructs a URL query object based on provided parameters
 *
 * @param {Object} params - The parameters for constructing the URL query
 * @param {number} [params.page=1] - the page number for paginated results
 * @param {number} [limit=apiConfig.DEFAULT_LIMIT] - The limit of items per page, with a default value from the API configuration
 * @returns {Object} - The URL query object with properties for limit, offset and page
 */
const getUrlQuery = (params, limit = apiConfig.DEFAULT_LIMIT) => {
  const { page = 1 } = params;
  const /** {number} */ offset = limit * page - limit / 2;

  return { limit, offset, page };
};

module.exports = {
  generateRandomString,
  getUrlQuery,
};
