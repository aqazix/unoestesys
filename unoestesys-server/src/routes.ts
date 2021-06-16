import express from "express"
import multer from "multer"
import verify from "./utils/authorization"
import Appointment from "./controllers/appointment"
import Conflict from "./controllers/conflict"
import Course from "./controllers/course"
import File from "./controllers/file"
import Form from "./controllers/form"
import Login from "./controllers/login"
import Module from "./controllers/module"
import Notification from "./controllers/notification"
import Role from "./controllers/role"
import Subject from "./controllers/subject"
import User from "./controllers/user"
import Time from "./controllers/time"

const routes = express.Router()
const upload = multer({ dest: "./files"})
const appointmentController = new Appointment()
const conflictController = new Conflict()
const courseController = new Course()
const fileController = new File()
const formController = new Form()
const loginController = new Login()
const moduleController = new Module()
const notificationController = new Notification()
const roleController = new Role()
const subjectController = new Subject()
const userController = new User()
const timeController = new Time()

routes.delete("/course/:id", verify, courseController.delete)
routes.delete("/form/:id", verify, formController.delete)
routes.delete("/notification/:id", verify, notificationController.delete)
routes.delete("/subject/:id", verify, subjectController.delete)
routes.delete("/time/:id", verify, timeController.delete)
routes.delete("/user/:id", verify, userController.delete)

routes.get("/appointment", verify, appointmentController.index)
routes.get("/appointment/:id", verify, appointmentController.show)
routes.get("/course", verify, courseController.index)
routes.get("/course/:id", verify, courseController.show)
routes.get("/conflict", verify, conflictController.index)
routes.get("/file", fileController.export)
routes.get("/form", verify, formController.index)
routes.get("/form/:id", verify, formController.show)
routes.get("/module", verify, moduleController.index)
routes.get("/module/:number", verify, moduleController.show)
routes.get("/notification", verify, notificationController.index)
routes.get("/role", verify, roleController.index)
routes.get("/role/:id", verify, roleController.show)
routes.get("/subject", verify, subjectController.index)
routes.get("/subject/:id", verify, subjectController.show)
routes.get("/time", verify, timeController.index)
routes.get("/time/:id", verify, timeController.show)
routes.get("/user", verify, userController.index)
routes.get("/user/:id", verify, userController.show)

routes.post("/appointment", verify, appointmentController.create, conflictController.create, notificationController.create)
routes.post("/course", verify, courseController.create)
routes.post("/form", verify, formController.create, formController.setForm)
routes.post("/login", loginController.signIn)
routes.post("/subject", verify, subjectController.create)
routes.post("/time", verify, timeController.create)
routes.post("/user", userController.create)
routes.post("/user/manage", verify, userController.manage)
routes.post("/user/sendRecover", userController.sendRecover)

routes.put("/appointment", verify, appointmentController.update, appointmentController.create, conflictController.create, notificationController.create)
routes.put("/appointment/delete", verify, appointmentController.delete)
routes.put("/conflict/delete", verify, conflictController.delete, notificationController.create)
routes.put("/course", verify, courseController.update)
routes.put("/form", verify, formController.update)
routes.put("/module", verify, moduleController.update)
routes.put("/subject", verify, subjectController.update, subjectController.changeProfessors)
routes.put("/time", verify, timeController.update)
routes.put("/user", verify, userController.update, userController.saveImage)
routes.put("/user/recover/:token", userController.recover)
routes.put("/user/updateRole", verify, userController.updateRole)

export default routes