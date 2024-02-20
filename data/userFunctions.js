const user = require("../db_schemas/user");

const signInUser = async (clientusername, clientpassword) => {
  try {
    let result = "";
    const data = await user.find({ username: clientusername });
    if (data.length) {
      if (data[0].username === clientusername) {
        if (data[0].password === clientpassword) {
          result = "accepted";
        } else {
          result = "wrong password";
        }
      } else {
        result = "wrong details";
      }
    } else {
      result = "wrong details";
    }
    return result;
  } catch (error) {
    return "Error: Signin error";
  }
};

const signUpUser = async (clientusername, clientpassword) => {
  try {
    let result = "";
    const data = await user.find({ username: clientusername });
    // check if already registered
    if (data.length !== 0) {
      if (data[0].username === clientusername) {
        result = "already registered";
        return result;
      } else {
        // TODO: check
        result = "already registered";
        return result;
      }
    } else {
      // if username not in db register new user
      // save data into db model
      const newUser = new user({
        id: crypto.randomUUID(),
        username: clientusername,
        password: clientpassword,
        email: "",
        key: "",
      });
      // save request to db
      await newUser.save();
      return "registered";
    }
  } catch (error) {
    return "Error: Signup error";
  }
};

// TODO: Implement updates to user
const updateUser = async (username, updateType, updateData) => {};

module.exports = { signInUser, signUpUser };
