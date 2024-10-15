import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: function (req, res) {
    console.warn(`Rate limit reached for IP: ${req.ip}`);
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
//   onLimitReached: (req, res, options) => {
//     console.warn(`Rate limit reached for IP: ${req.ip}`);
//     // Further action like logging or alerting
//   },
});
export {limiter}
