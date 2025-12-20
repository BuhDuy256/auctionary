// This route is only used for testing mail templates

import { Router } from "express";
import * as emailService from "../../services/email.service";

const router = Router();

router.post("/otp", (req, res) => {
  emailService.sendOTPEmail(req.body.email, req.body.otp, req.body.userName);
  res.status(200).json({ message: "OTP email sent successfully" });
});

export default router;
