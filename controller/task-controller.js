const Task = require('../models/Task');

const addTask = async (req, res) => {
    try {
        const { title, description, dueDate, status, priority } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
            status,
            priority,
        });

        await newTask.save();
        res.status(201).json({ message: "New task has been stored", task: newTask });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const getAllTasks = async (req, res) => {
    try {
        const allUsers = await Task.find({ is_deleted: false });
        // console.log('Found documents:', allusers);
        res.json(allUsers);
    } catch (error) {
        console.error('Error querying database:', error);
        res.json({ message: "Error" });
    }
};



const getTaskById = (req, res) => {
    let TaskId = req.params.id;
    Task.findById(TaskId, { is_deleted: false })
        .then(response => {
            if (response) {
                res.json({ response });
            } else {
                res.json({ message: "Task not found" });
            }
        })
        .catch(error => {
            console.error('Error querying database:', error);
            res.json({ message: "Error fetching Task" });
        });
};

const updateStatus = async (req, res) => {
    try {
        const TaskId = req.params.id;
        const updatedTask = await Task.findByIdAndUpdate(
            TaskId,
            { status: req.body.status },
            { new: true }

        );

        if (updatedTask) {
            res.json({ message: "Task updated successfully", updatedTask });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        console.error('Error updating Task:', error);
        res.status(500).json({ message: "Error updating Task" });
    }
};


const updateTasks = async (req, res) => {
    try {
        const TaskId = req.params.id;
        const { status, ...updateFields } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            TaskId,
            updateFields,
            { new: true }

        );

        if (updatedTask) {
            res.json({ message: "Task updated successfully", updatedTask });
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        console.error('Error updating Task:', error);
        res.status(500).json({ message: "Error updating Task" });
    }
};



const removeTask = async (req, res) => {
    try {
        const TaskId = req.params.id;
        const removeTask = await Task.findByIdAndUpdate(
            TaskId,
            { is_deleted: true },
            { new: true } // To get the updated document as a result
        );
        if (removeTask) {
            res.json({ message: "Employee deleted successfully", removeTask });
        } else {
            res.json({ message: "Employee not found" });
        }
    } catch (error) {
        res.json({ message: "Error deleting employee" });
    }
};
module.exports = {
    addTask,
    getAllTasks,
    getTaskById,
    updateStatus,
    removeTask,
    updateTasks
}