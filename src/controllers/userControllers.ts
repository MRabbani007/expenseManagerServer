import { RequestHandler, Response } from "express";
import user from "../db_schemas/user";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TypedRequest } from "../types";

export const handleSignUp: RequestHandler = async (req, res) => {
  try {
    let { username, password } = req.body.payload;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }

    const duplicate = await user.findOne({ username: username }).exec();
    // check if already registered
    if (duplicate) {
      return res.sendStatus(409);
    }

    // if username not in db register new user

    // encrypt password
    const hashedPwd = await bcrypt.hash(password, 10);

    // save user to DB
    const result = await user.create({
      id: crypto.randomUUID(),
      username: username,
      password: hashedPwd,
      name: "",
      email: "",
      roles: 2001,
      createDate: new Date(),
      active: false,
      lastSigin: new Date("1900-01-01"),
      refreshToken: "",
      accessToken: "",
    });

    return res.status(201);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const handleSignIn: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req?.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Username and Password are required",
      });
    }

    let foundUser = await user.findOne({ username: username });

    if (!foundUser) {
      return res.sendStatus(401);
      // .json({ status: "failed", message: "wrong details" });
    }

    if (foundUser.username !== username) {
      return res.sendStatus(401);
      // .json({ status: "failed", message: "wrong cretdentials" });
    }

    let match = null;
    const bcryptCompare = async () => {
      return bcrypt.compare(password, foundUser.password);
    };

    // Temporary check if password encrypted
    if (foundUser.password.length < 10) {
      match = foundUser.password === password;
    } else {
      // encrypt password
      match = await bcryptCompare();
    }

    if (!match) {
      return res
        .status(401)
        .json({ status: "failed", message: "wrong credentials" });
    }

    if (!process.env?.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET)
      return res.sendStatus(500);

    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      { username: foundUser.username, roles: roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(202).json({
      username: foundUser.username,
      roles,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const handleRefreshToken = async (req: TypedRequest, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.sendStatus(401); // not authorized
    }

    const refreshToken = cookies.jwt;
    const foundUser = await user
      .findOne({
        refreshToken: refreshToken,
      })
      .exec();

    if (!foundUser) {
      return res.sendStatus(403); // forbiden
    }

    if (!process.env?.REFRESH_TOKEN_SECRET || !process.env?.ACCESS_TOKEN_SECRET)
      return res.sendStatus(500);

    // evaluate JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error: any, decoded: any) => {
        if (error || !decoded || foundUser.username !== decoded.username) {
          res.sendStatus(403);
          return;
        } else {
          const roles = Object.values(foundUser.roles);
          const accessToken = jwt.sign(
            {
              username: decoded.username,
              roles: roles,
            },
            process.env?.ACCESS_TOKEN_SECRET ?? "",
            { expiresIn: "10m" }
          );
          res
            .status(200)
            .json({ username: foundUser.username, roles, accessToken });
        }
      }
    );

    return res;
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const handleSignOut: RequestHandler = async (req, res) => {
  try {
    const cookies = req.cookies;
    // const username = req.body.username;
    if (!cookies?.jwt) {
      return res.sendStatus(204); // no content
    }

    // check if refresh token in DB
    const refreshToken = cookies.jwt;
    const foundUser = await user
      .findOne({
        refreshToken: refreshToken,
      })
      .exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.sendStatus(204); // no content
    }

    // Delete refreshToken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    }); // secure: true ony serves on https

    return res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500);
  }
};

const handleUserDescriptions: RequestHandler = async (req, res) => {
  return res.sendStatus(204);
  // try {
  //   const action = req?.body?.action;
  //   const { type, payload } = action;
  //   switch (type) {
  //     case "USER_DESC_GET": {
  //       let data = await user.findOne(
  //         { username: payload.username },
  //         { descriptions: 1 }
  //       );
  //       return res.status(200).json({ descriptions: data.descriptions });
  //     }
  //     case ACTIONS.USER_DESC_ADD: {
  //       let data = await user.findOne(
  //         { username: payload.username },
  //         { descriptions: 1 }
  //       );
  //       let description = payload.description;
  //       if (!Array.isArray(description)) {
  //         description = [description];
  //       }
  //       temp = data.descriptions.filter(
  //         (newDesc) =>
  //           description.findIndex((desc) => desc.name === newDesc.name) < 0
  //       );
  //       const newDesc = temp.concat(description);
  //       user
  //         .updateOne(
  //           { username: payload.username },
  //           { $set: { descriptions: newDesc } }
  //         )
  //         .exec();
  //       return res.status(200).json({ status: "success", message: "added" });
  //     }
  //     case ACTIONS.USER_DESC_REMOVE: {
  //       let data = await user.findOne(
  //         { username: payload.username },
  //         { descriptions: 1 }
  //       );
  //       const newDesc = data.descriptions.filter(
  //         (desc) => desc.name !== payload.description.name
  //       );
  //       user
  //         .updateOne(
  //           { username: payload.username },
  //           { $set: { descriptions: newDesc } }
  //         )
  //         .exec();
  //       return res.status(200).json({ status: "success", message: "removed" });
  //     }
  //     default: {
  //     }
  //   }
  //   res.sendStatus(200);
  // } catch (error) {
  //   console.log(error);
  //   return res.sendStatus(500);
  // }
};

const handleUserPassword: RequestHandler = async (req, res) => {
  try {
    let { type, payload } = req.body.action;
    let { username, password, newPassword } = payload;
    if (!username || !password || !newPassword) {
      console.log("Change Password Request: Missing Credentials");
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    } else {
      const foundUser = await user.findOne({ username: username }).exec();
      if (foundUser.username === username) {
        let match = {};
        const bcryptCompare = async () => {
          return bcrypt.compare(password, foundUser.password);
        };

        // Temporary check if password encrypted
        if (foundUser.password.length < 10) {
          match = foundUser.password === password;
        } else {
          // encrypt password
          match = await bcryptCompare();
        }
        if (match) {
          // encrypt password
          const hashedPwd = await bcrypt.hash(newPassword, 10);
          foundUser.password = hashedPwd;
          let result = await foundUser.save();
          return res
            .status(200)
            .json({ status: "success", message: "changed" });
        } else {
          console.log("error");
          return res.status(400).json({ message: "Wrong Password" });
        }
      }
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const getUserID = async (username: string) => {
  try {
    const data = await user.find({ username: username });
    if (data.length !== 0) {
      return data[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error: get user ID");
  }
};

// Get user details for admin
const handleGetUsers: RequestHandler = async (req, res) => {
  try {
    const data = await user.find(
      {},
      { password: 0, accessToken: 0, refreshToken: 0 }
    );
    if (data.length !== 0) {
      return res.status(200).json(data);
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {}
};

// Get settings for user
const handleUserGetSettings: RequestHandler = async (req, res) => {
  try {
    const username = req?.body?.username;

    const data = await user
      .findOne(
        { username: username },
        { name: 1, email: 1, theme: 1, descriptions: 1 }
      )
      .exec();
    if (data.length !== 0) {
      return res.status(200).json(data);
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const handleUserEditSettings: RequestHandler = async (req, res) => {
  try {
    const action = req?.body?.action;
    const { type, payload } = action;
    switch (type) {
      case "EDIT_NAME": {
        if (!payload?.name) {
          return res
            .status(200)
            .json({ status: "failed", message: "name not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { name: payload?.name } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      case "EDIT_EMAIL": {
        if (!payload?.email) {
          return res
            .status(200)
            .json({ status: "failed", message: "email not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { email: payload?.email } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      case "EDIT_THEME": {
        if (!payload?.theme) {
          return res
            .status(200)
            .json({ status: "failed", message: "theme not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { theme: payload?.theme } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      // TODO: add edit currency
      case "EDIT_DISPLAY_CURRENCY": {
        if (!payload?.currency) {
          return res
            .status(200)
            .json({ status: "failed", message: "currency not found" });
        } else {
          const data = await user
            .updateOne(
              { username: payload?.username },
              { $set: { currency: payload?.currency } }
            )
            .exec();
          return res.status(200).json({ status: "success", message: "added" });
        }
      }
      default: {
        res.sendStatus(204);
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
