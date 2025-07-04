import { Router } from "express";
import { getUsers } from "../../modules/user";
import { saveUser } from "../../modules/user";
import { getSocketIO } from "../../socketHandler";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     description: Retrieves a complete list of all users in the system.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to get users
 */
router.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ error: "Failed to get users" });
  }
});

// POST create new user
router.post("/users", async (req, res) => {
  try {
    const { fullName, email, contactNo, isApprove, isActive, isTempName } = req.body;

    if (!fullName || !contactNo) {
      return res.status(400).json({ error: "fullName and contactNo are required" });
    }

    const userData = {
      fullName,
      email,
      contactNo,
      isApprove: isApprove || "pending",
      isActive: isActive ?? true,
      isTempName: isTempName ?? true,
    };

    const newUser = await saveUser(userData);

    // Emit real-time socket event
    const io = getSocketIO();
    if (io) {
      io.emit("user_created", newUser); // You can customize event name
    }

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

export default router;
