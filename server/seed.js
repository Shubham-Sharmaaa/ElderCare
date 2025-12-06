import "dotenv/config";
import { connectDB } from "./config/db.js";
import Elder from "./models/Elder.js";
import Vital from "./models/Vital.js";

async function run() {
  await connectDB(process.env.MONGO_URI);
  const e = await Elder.create({
    name: "Rajinder Kaur",
    age: 68,
    conditions: ["Asthma", "Arthritis"],
    hospital: "Fortis Patiala",
    doctor: "Dr. Patel",
  });
  await Vital.create({ elderId: e._id, hr: 92, spo2: 95, sys: 132, dia: 84 });
  console.log("[seed] elder id:", e._id.toString());
  process.exit(0);
}
run();
