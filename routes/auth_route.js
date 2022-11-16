const express = require('express');
const router = express.Router();
const student_controller = require('../controllers/auth_account');

// router.post('/register',student_controller.addAccount);
router.post('/login',student_controller.loginAccount);
router.get('/updateform/:email',student_controller.updateform);
router.post('/updateStudent',student_controller.updateStudent);
router.get('/deleteStudent/:email',student_controller.deleteStudent);
router.get('/logout',student_controller.logout);
router.post('/addStudent',student_controller.addStudent);

module.exports = router;
