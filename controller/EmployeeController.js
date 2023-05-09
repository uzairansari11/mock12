const express = require("express");
const { EmployeeModel } = require("../model/EmployeeModel");

const employeeRouter = express.Router();

/* Create a new employee */
employeeRouter.post("/employees", async (req, res) => {
    const { first_name, last_name, email, department, salary } = req.body;
    try {
        if (first_name && last_name && email && department && salary) {
            let newEmployee = await EmployeeModel(req.body);
            await newEmployee.save();
            res
                .status(200)
                .send({
                    message: "New employee created successfully",
                    data: newEmployee,
                });
        } else {
            res.status(200).send({ message: "Please provide all details" });
        }
    } catch (error) {
        res.status(404).send({ message: "Something went wrong" });
    }
});

/* Get all the employeee */
let skip = 0
let limit = 0
let page = 1
employeeRouter.get("/employees", async (req, res) => {
    const query = req.query;
    const filter = {};
    if (query.department) {
        filter.department = query.department;
    }
    if (query.page && query.limit) {
        skip = ((page = query.page) - 1) * (limit = query.limit);
    }
    if (query.first_name) {
        filter.first_name = query.first_name
    }

    try {
        let allEmployee = await EmployeeModel.find(filter)
            .limit(query.limit)
            .skip(skip);
        if (query.sort && query.order) {
            if (query.order == "asc") {
                allEmployee.sort((a, b) => a.salary - b.salary);
            }
            if (query.order == "desc") {
                allEmployee.sort((a, b) => b.salary - a.salary);
            }
        }

        res.status(200).send({ message: "All employess list", data: allEmployee });
    } catch (error) {
        res.status(404).send({ message: "Something went wrong", error });
    }
});

/* Delete an employee */

employeeRouter.delete("/employees/:id", async (req, res) => {
    const id = req.params.id;

    try {
        EmployeeModel.findByIdAndDelete({ id });
        res.status(200).send({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(404).send({ message: "Something went wrong", error });
    }
});

/* Edit employee data  */

employeeRouter.patch("/employees/:id", async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    try {
        let updatedData = await EmployeeModel.findByIdAndUpdate(
            { _id: id },
            payload,
        );
        let savedData = await EmployeeModel.findById({ _id: id });

        res
            .status(200)
            .send({ message: "Employee updated successfully", data: savedData });
    } catch (error) {
        res.status(404).send({ message: "Something went wrong", error });
    }
});
module.exports = { employeeRouter };
