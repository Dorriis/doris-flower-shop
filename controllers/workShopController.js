const Workshop = require('../models/workshopModel');

const addWorkshop = async (req, res) => {
    const { topic, date, time, content } = req.body;

    try {
        const workshop = new Workshop({ topic, date, time, content });
        await workshop.save();
        res.status(201).json(workshop);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add workshop', error });
    }
};

const getAllWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find();
        res.status(200).json(workshops);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve workshops', error });
    }
};

const getWorkshopById = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.status(200).json(workshop);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching workshop', error });
    }
};

const updateWorkshop = async (req, res) => {
    try {
        const updatedWorkshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedWorkshop) return res.status(404).json({ message: 'Workshop not found' });
        res.status(200).json(updatedWorkshop);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update workshop', error });
    }
};

const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndDelete(req.params.id);
        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
        res.status(200).json({ message: 'Workshop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete workshop', error });
    }
};

module.exports = {
    addWorkshop,
    getAllWorkshops,
    getWorkshopById,
    updateWorkshop,
    deleteWorkshop,
};
