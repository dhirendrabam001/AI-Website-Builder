// Usage: npm run credits -- <email> [amount]     (amount defaults to 1000)
//        npm run credits -- --all [amount]       (every user)
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const { User } = require("../models/user.models");

const run = async () => {
  const [target, amountArg] = process.argv.slice(2);
  const amount = Number(amountArg ?? 1000);

  if (!target || !Number.isInteger(amount) || amount < 0) {
    console.error("Usage: npm run credits -- <email|--all> [amount]");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const filter = target === "--all" ? {} : { email: target.toLowerCase() };
  const result = await User.updateMany(filter, { $set: { aiCredits: amount } });

  console.log(`Matched ${result.matchedCount} user(s), set aiCredits = ${amount}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
