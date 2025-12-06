const { Setting } = require('../models');

const getSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
};

const updateSettings = async (data) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return settings;
};

module.exports = { getSettings, updateSettings };
