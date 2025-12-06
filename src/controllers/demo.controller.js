const demoService = require('../services/demo.service');

const createDemoRequest = async (req, res, next) => {
  try {
    const request = await demoService.createDemoRequest(req.body);
    res.status(201).json({ message: 'Demo request submitted successfully', request });
  } catch (error) {
    next(error);
  }
};

const getAllDemoRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const requests = await demoService.getAllDemoRequests(status);
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const getDemoRequestById = async (req, res, next) => {
  try {
    const request = await demoService.getDemoRequestById(req.params.id);
    res.json(request);
  } catch (error) {
    next(error);
  }
};

const approveDemoRequest = async (req, res, next) => {
  try {
    const request = await demoService.approveDemoRequest(req.params.id, req.body);
    res.json({ message: 'Demo request approved', request });
  } catch (error) {
    next(error);
  }
};

const rejectDemoRequest = async (req, res, next) => {
  try {
    const request = await demoService.rejectDemoRequest(req.params.id, req.body.reason);
    res.json({ message: 'Demo request rejected', request });
  } catch (error) {
    next(error);
  }
};

const convertToStudent = async (req, res, next) => {
  try {
    const result = await demoService.convertToStudent(req.params.id, req.body);
    res.json({ message: 'Student created successfully', ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDemoRequest, getAllDemoRequests, getDemoRequestById, approveDemoRequest, rejectDemoRequest, convertToStudent };
