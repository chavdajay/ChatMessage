// import mongoose from "mongoose";
// mongoose.set("strictQuery", true);
// mongoose.set("strictPopulate", false);
// export const connectDb = () => {
//   return mongoose.connect(process.env.DB_URL, {
//     dbName: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     pass: process.env.DB_PASS,
//   });
// };


// updated Code //

import mongoose from "mongoose";
mongoose.set("strictQuery", true);
mongoose.set("strictPopulate", false);

export const connectDb = () => {
  const dbUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;

  if (!dbUrl) throw new Error("❌ DB_URL is not defined");
  if (!dbName) throw new Error("❌ DB_NAME is not defined");

  return mongoose.connect(dbUrl, {
    dbName,
    user: dbUser,
    pass: dbPass,
  });
};
