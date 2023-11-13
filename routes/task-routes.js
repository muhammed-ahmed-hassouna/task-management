const express = require('express');
const router = express.Router()

const taskController = require('../controller/task-controller');

router.post("/addTask", taskController.addTask);

router.get("/getAllTask", taskController.getAllTasks);

router.get("/getTaskById/:id", taskController.getTaskById);

router.put("/updateStatus/:id", taskController.updateStatus);

router.put("/updateTasks/:id", taskController.updateTasks);

router.put("/removeTask/:id", taskController.removeTask);


module.exports = router;