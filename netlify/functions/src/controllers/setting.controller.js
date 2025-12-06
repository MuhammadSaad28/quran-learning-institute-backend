const settingService = require('../services/setting.service');

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingService.updateSettings(req.body);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
