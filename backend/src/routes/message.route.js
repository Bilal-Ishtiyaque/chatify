import {Router} from "express";

import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute); // by using it here like this, it will run before any of the below routes

router.get("/contacts", getAllContacts); // protectRoute mean that only authenticated users can fetch the contacts or whatever

router.get("/chats", getChatPartners);

router.get("/:id", getMessagesByUserId); // If a generic route (/:id) comes before a more specific one (/contacts OR /send/:id) with the same HTTP method, the more specific route never gets a chance to run. because Express matches routes top to bottom and stops at the first match.

router.post("/send/:id", sendMessage); // /send, then user you want to send to message to ':id', so -> /send/:id

export default router;