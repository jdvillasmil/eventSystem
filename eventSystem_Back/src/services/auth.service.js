import * as DataBase from "../data/DataBase.js";
import bcrypt from "bcryptjs"; // or bcrypt

export async function authenticate(username, password) {
  const { rows } = await DataBase.executeQuery(
    "public",
    "getUserByUsername",
    [username]
  );
  const user = rows[0];
  if (!user?.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: user.id,
    userName: user.username,
    profileId: user.profileId
  };
}

export function startSession(req, user, getSessionObject) {
  const base = getSessionObject();
  base.userId = user.id;
  base.userName = user.userName;
  base.profileId = user.profileId;
  base.status = "authenticated";
  req.session.userId = base.userId;
  req.session.userName = base.userName;
  req.session.profileId = base.profileId;
  req.session.status = base.status;
  return base;
}

export function logout(req) {
  return new Promise((resolve, reject) => {
    if (!req.session) return resolve();
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
