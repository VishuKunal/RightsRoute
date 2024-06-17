const jwt = require("jsonwebtoken");
const User = require("../models/user");
//const sharp = require('sharp');

const crime_1 = require('../models/crime_1');
const crime_2 = require('../models/crime_2');
const crime_3 = require('../models/crime_3');
const crime_4 = require('../models/crime_4');

exports.createUser = async (req, res) => {
  const { FULL_NAME, STATE, PIN_CODE, EMAIL_ID, PASSWORD } = req.body;

  const isNewUser = await User.isThisEmailInUse(EMAIL_ID);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use, try signing in",
    });

  const user = await User({
    FULL_NAME,
    STATE,
    PIN_CODE,
    EMAIL_ID,
    PASSWORD,
  });

  await user.save();

  res.json({ success: true, user });
};

exports.userSignIn = async (req, res) => {
  const { EMAIL_ID, PASSWORD } = req.body;
  const user = await User.findOne({ EMAIL_ID });

  if (!user)
    return res.json({
      success: false,
      message: "user not found with the given email",
    });
  const isMatch = await user.comparePassword(PASSWORD);
  if (!isMatch)
    return res.json({
      success: false,
      message: "email/password does not match",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens=user.tokens||[];

  if(oldTokens.length)
  {
    oldTokens=oldTokens.filter (t=>{
        const timeDiff= (Date.now()-parseInt(t.signedAt))/1000;
        if(timeDiff<86400)
        {
          return t;

        }
    })
  }

  await User.findByIdAndUpdate(user._id,{tokens:[...oldTokens,{token:token,signedAt:Date.now().toString()}]})

  const userInfo = {
    FULL_NAME: user.FULL_NAME,
    EMAIL_ID: user.EMAIL_ID,
  };
  res.json({ success: true, user, token });
};




exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter(t => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};



exports.searchCrimes = async (req, res) => {
  const { query } = req.query;

  try {
    // Search in crime_1 based on the provided query name
    const searchResults1 = await crime_1.find({
      Name: { $regex: new RegExp(query, "i") }
    }).exec();

    // Extract sub array from the first search results
    const subArray = searchResults1[0]?.sub || [];

    // Search in crime_2 using subArray from crime_1 results
    const searchResults2 = await crime_2.find({
      _id: { $in: subArray }
    }).exec();

    // Extract names and descriptions from searchResults2 and create an array of objects
    const resultsArray = searchResults2.map(result => ({
      name: result.Name,
      description: result.Description
    }));

    // Return the results array to the frontend
    res.json(resultsArray);
  } catch (error) {
    console.error("Error searching crimes:", error);
    res.status(500).json({ error: "An error occurred while searching crimes." });
  }
};




exports.searchCrimes2 = async (req, res) => {
  const { query } = req.query;

  try {
    // Search in crime_1 based on the provided query name
    const searchResults2 = await crime_2.find({
      Name: { $regex: new RegExp(query, "i") }
    }).exec();

    // Extract sub array from the first search results
    const subArray = searchResults2[0]?.sub || [];

    // Search in crime_2 using subArray from crime_1 results
    const searchResults3 = await crime_3.find({
      _id: { $in: subArray }
    }).exec();

    if (searchResults3.length > 0) {

    // Extract names from searchResults2 and create an array
    const resultsArray = searchResults3.map(result => ({
      name: result.Name,
      description: result.Description
    }));

    // Return the results array to the frontend
    res.json(resultsArray);
  }
  else {
    const searchResults5 = await crime_4.find({
      _id: { $in: subArray }
    }).exec();

    const resultsArray = searchResults5.map(result => ({
      name: result.Name,
      description: result.Description
    }));
    res.json(resultsArray);
  }
  } catch (error) {
    console.error("Error searching crimes:", error);
    res.status(500).json({ error: "An error occurred while searching crimes." });
  }
};


exports.searchCrimes3 = async (req, res) => {
  const { query } = req.query;

  try {
    // Search in crime_1 based on the provided query name
    const searchResults3 = await crime_3.find({
      Name: { $regex: new RegExp(query, "i") }
    }).exec();

    // Extract sub array from the first search results
    const subArray = searchResults3[0]?.sub || [];

    // Search in crime_2 using subArray from crime_1 results
    const searchResults4 = await crime_4.find({
      _id: { $in: subArray }
    }).exec();

    // Extract names from searchResults2 and create an array
    const resultsArray = searchResults4.map(result => ({
      name: result.Name,
      description: result.Description
    }));

    // Return the results array to the frontend
    res.json(resultsArray);
  } catch (error) {
    console.error("Error searching crimes:", error);
    res.status(500).json({ error: "An error occurred while searching crimes." });
  }
};


exports.searchCrimes4 = async (req, res) => {
  const { query } = req.query;
  console.log(query);

  try {
    const finalResults = await crime_4.find({
      Name: { $regex: new RegExp(query, "i") }
    }).exec();

    //console.log("Matching documents:", finalResults);

    if (finalResults.length > 0) {
      // console.log(finalResults)
      res.json(finalResults);
    } else {
      res.status(404).json({ error: "No results found for the provided query." });
    }
  } catch (error) {
    console.error("Error searching crimes:", error);
    res.status(500).json({ error: "An error occurred while searching crimes." });
  }
};



