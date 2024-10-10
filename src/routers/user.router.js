import { Router } from "express"
import {changePassword, login, logout, profileDelete, profileUpdate, signup, users} from "../controllers/user.controller.js"
import {verifyToken} from "../middleware/isLoggedIn.js"
const router= Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/profile-update").put(verifyToken,profileUpdate)
router.route("/profile-delete").delete(verifyToken,profileDelete)
router.route("/change-password").put(verifyToken,changePassword)
router.route("/users").get(users)
/// forgot password is pending//

export default router;