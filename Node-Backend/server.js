const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const mongoURI = "mongodb://localhost:27017";
const dbName = "Student_Management_System";
const collectionName = "GradeLevel";
const studentDetailsCollection = "Student-Details";
const FeesDetails = "Fees-Details";
const InActiveCollection = "In-Active";
const LoginUser = "LoginUser";

let db;

MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    //Login Datas Get Start..

    app.get("/Login-user", async (req, res) => {
      try {
        const data = await db.collection(LoginUser).find().toArray();
        res.json(data);
      } catch (error) {
        console.log("Error geting Loginuser");
      }
    });
     
    app.put("/update-password/:userId", async (req, res) => {
      const userId = req.params.userId;
      const { newPassword } = req.body;
      try {
        await db.collection(LoginUser).updateOne(
          { _id:new ObjectId(userId) }, 
          { $set: { Password: newPassword } }
        );
        res.status(200).json({ message: "Password updated successfully" });
      } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
      }
    });

    

    //Login Datas Get End..

    //all collection count start.
    app.get("/student-details/count", async (req, res) => {
      try {
        const count = await db
          .collection(studentDetailsCollection)
          .countDocuments();
        res.json({ count });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/inActive/count", async (req, res) => {
      try {
        const count = await db.collection(InActiveCollection).countDocuments();
        res.json({ count });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get("/feescount", async (req, res) => {
      try {
        const balances = await db
          .collection(studentDetailsCollection)
          .find({}, { balance: 1, totalFees: 1, _id: 0 })
          .toArray();
    
        res.json({ balances });
      } catch (error) {
        console.error("Error fetching student balances:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    
    //all collection count end..

    app.post("/Student_Detail", async (req, res) => {
      try {
        const {
          FullName,
          contact,
          parentContact,
          aadhar,
          internid,
          stgrade,
          doj,
          totalFees,
          balance,
          feesRemarks,
          aboutStudent,
          email,
        } = req.body;
        const result = await db.collection(studentDetailsCollection).insertOne({
          FullName,
          contact,
          parentContact,
          aadhar,
          internid,
          stgrade,
          doj,
          totalFees,
          balance,
          feesRemarks,
          aboutStudent,
          email,
        });
        res.status(201).json(result);
      } catch (error) {
        console.error("Error saving student details:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/fetchStudent_Detail", async (req, res) => {
      try {
        const data = await db
          .collection(studentDetailsCollection)
          .find()
          .toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    });

    // Update the endpoint to handle updates for all fields
    app.put("/update-student-details/:id", async (req, res) => {
      const { id } = req.params;
      const updatedStudent = req.body;
      try {
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid ID format" });
        }

        delete updatedStudent._id;

        const result = await db
          .collection(studentDetailsCollection)
          .updateOne({ _id: new ObjectId(id) }, { $set: updatedStudent });
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Student updated successfully" });
        } else {
          res.status(404).json({ message: "Student not found" });
        }
      } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //Student details end..

    //student delete to post anothe page in-Active...
    app.post("/inActive", async (req, res) => {
      try {
        const studentToRemove = req.body.studentToRemove;
    
        // Generate a new ObjectId for the deleted student
        studentToRemove._id = new ObjectId();
    
        // Check if a student with the same ID already exists
        const existingStudent = await db.collection(InActiveCollection).findOne({ _id: studentToRemove._id });
        if (existingStudent) {
          return res.status(400).json({ error: "Student with the same ID already exists" });
        }
    
        // Insert the deleted student into the InActiveCollection
        await db.collection(InActiveCollection).insertOne(studentToRemove);
        
        // Send a success response
        res.status(201).json({ message: "Deleted student saved successfully" });
      } catch (error) {
        console.error("Error inserting deleted student:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    

    app.get("/InactiveStudents", async (req, res) => {
      try {
        const inactiveStudents = await db
          .collection(InActiveCollection)
          .find({})
          .toArray();
        res.json(inactiveStudents);
      } catch (error) {
        console.error("Error fetching inactive students:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/delete-student/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await db
          .collection(studentDetailsCollection) 
          .deleteOne({ _id: new ObjectId(id) }); 
    
        if (result.deletedCount === 1) {
          res.status(200).json({ message: "Student deleted successfully" });
        } else {
          res.status(404).json({ message: "Student not found" });
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //student delete to post anothe page end in-Active...

    //inActive page
    app.post("/activate-student/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const inactiveStudent = await db
          .collection(InActiveCollection)
          .findOne({ _id: new ObjectId(id) });
        if (!inactiveStudent) {
          return res
            .status(404)
            .json({ message: "Inactive student not found" });
        }

        await db
          .collection(studentDetailsCollection)
          .insertOne(inactiveStudent);

        await db
          .collection(InActiveCollection)
          .deleteOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.error("Error activating inactive student:", error);
      }
    });

    app.delete("/deleteInactiveStudent/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await db
          .collection(InActiveCollection)
          .deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        console.error("Error deleting inactive student:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    //inActive page end..

    //  Grade page

    app.post("/Grade", async (req, res) => {
      try {
        const { grade, details } = req.body;
        const result = await db
          .collection(collectionName)
          .insertOne({ grade, details });
        res.json(result);
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    });

    app.get("/fetch-Grade", async (req, res) => {
      try {
        const data = await db.collection(collectionName).find().toArray();
        res.json(data);
      } catch (error) {
        console.error("Error fetching grade data:", error);
      }
    });

    app.put("/update-Grade/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { grade, details } = req.body;
        const result = await db
          .collection(collectionName)
          .updateOne({ _id: new ObjectId(id) }, { $set: { grade, details } });
        res.json(result);
      } catch (error) {
        console.error("Error updating grade:", error);
      }
    });

    app.delete("/Grade-delete/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await db
          .collection(collectionName)
          .deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        console.error("Error deleting grade:", error);
      }
    });

    //  Grade page end..

    //Fees-collect
    app.post("/Fees-collect", async (req, res) => {
      try {
        const { internid, Paid, Date, Remark } = req.body;
        const result = await db
          .collection(FeesDetails)
          .insertOne({ internid, Paid, Date, Remark });
        res.status(201).json({ message: "Fees collected successfully" });
      } catch (error) {
        console.error("Error collecting fees:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //get fees detail
    app.get("/fees-details/:internid", async (req, res) => {
      try {
        const { internid } = req.params;
        const feesCollection = await db
          .collection(FeesDetails)
          .find({ internid })
          .toArray();
        res.status(200).json(feesCollection);
      } catch (error) {
        console.error("Error fetching fees collection:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.put("/fetchStudent_Detail/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { balance } = req.body;

        const result = await db
          .collection(studentDetailsCollection)
          .updateOne({ _id: new ObjectId(id) }, { $set: { balance } });

        if (result.modifiedCount === 1) {
          return res.json({ message: "Student balance updated successfully" });
        } else {
          return res.status(404).json({ error: "Student not found" });
        }
      } catch (error) {
        console.error("Error updating student balance:", error);
      }
    });

    //Fees-collect end..

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.on("SIGINT", () => {
      client.close(() => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
