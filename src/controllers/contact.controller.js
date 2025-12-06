const contactService = require('../services/contact.service');

const sendContactForm = async (req, res, next) => {
  try {
    const result = await contactService.sendContactForm(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendContactForm };
