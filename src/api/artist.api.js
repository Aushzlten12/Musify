/**
 * @license Apache-2.0
 * @copyright JosePM 2024
 */

"use strict";

/**
 * custom modules
 */

const { getData } = require("../config/axios.config");
const apiConfig = require("../config/api.config");

/**
 * Get Spotify catalog information for several artists based on their Spotify IDs
 *
 * @param {Object} req - server request object
 * @param {string} artistIds - A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs
 * @returns {Object}
 */
const getSeveralDetails = async (req, artistIds) => {
  const { data: trackArtists } = await getData(
    `/artists?ids=${artistIds}`,
    req.cookies.access_token
  );
  return trackArtists;
};

module.exports = {
  getSeveralDetails,
};
