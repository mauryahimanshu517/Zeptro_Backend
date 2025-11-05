import express from "express";
import Razorpay from "razorpay";
import cors from "cors";

const app = express();

app.use(express.json());

// ✅ Configure CORS for both localhost and Netlify
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zeptroapp.netlify.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Handle OPTIONS preflight requests
app.options("*", cors());

const razorpay = new Razorpay({
  key_id: "rzp_test_RbazyuxUIauDAV",
  key_secret: "BXtxg6oMSj186n3YKInFk3Km",
});

app.post("/cart", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

app.get("/", (req, res) => res.send("✅ Backend running fine!"));

app.listen(5000, () => console.log("✅ Server running on port 5000"));
