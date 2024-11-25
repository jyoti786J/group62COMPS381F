const express = require('express');
const Student = require('../models/student');
const AcademicRecord = require('../models/academicRecord');
const router = express.Router();

// Create a new student
router.post('/', async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.redirect('/students');
});

// Read all students
router.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('dashboard', { students });
});

// Read a single student
router.get('/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('studentForm', { student });
});

// Update a student
router.put('/:id', async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/students');
});

// Delete a student
router.delete('/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    await AcademicRecord.deleteMany({ studentId: req.params.id }); // Delete associated records
    res.redirect('/students');
});

// Academic Records Management
router.get('/:id/records', async (req, res) => {
    const records = await AcademicRecord.find({ studentId: req.params.id }).populate('studentId');
    res.render('academicRecordForm', { records, studentId: req.params.id });
});

router.post('/:id/records', async (req, res) => {
    const record = new AcademicRecord({ ...req.body, studentId: req.params.id });
    await record.save();
    res.redirect(`/students/${req.params.id}/records`);
});

module.exports = router;
