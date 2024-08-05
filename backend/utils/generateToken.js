import jwt from "jsonwebtoken";

const generateTokenandSetCookie = async (id, res) => {
  const token = jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  return token;
};
export default generateTokenandSetCookie;
