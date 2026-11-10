import {createEmployee,getAllEmployees} from "../repositories/employeeRepository.js";

export async function addEmployee(req,res){
    try{
        const {name,email,department} = req.body;
        if (typeof name !== 'string' || typeof name.trim() !== 'string' || typeof email !== 'string' || typeof email.trim() !== 'string' ) {
            return res.status(400).json({
                message: "valid name and email are required."
            });

        }

        const employee = await createEmployee(
            {
                name : name.trim(),
                email : email.trim().toLowerCase(),
                department : typeof department === "string"? department.trim() : "Sales", createdAt: new Date()
     
       
        
            }
        );

        return res.status(201).json(employee);

    }

    catch(error){
        if(error.code === 11000) {
      return res.status(409).json({
        message: "Employee email already exists"
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Failed to create employee"
    });
  }
}

// Handle a request to retrieve employees
export async function fetchEmployees(req, res) {
  try {
    const employees = await getAllEmployees();

    return res.status(200).json(employees);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch employees"
    });
  }
}