import * as DataBase from "../data/DataBase.js";

class SecurityCache {
  constructor() {
    // profileId -> Map(objectName -> Set(methodName))
    this.methodPermission = new Map();
    this.loaded = false;
  }

  async loadPermission() {
    const tmp = new Map();
    const { rows } = await DataBase.executeQuery("security", "loadMethods", []);
    for (const r of rows) {
      const pid = Number(r.profileId);
      const obj = String(r.objectName);
      const met = String(r.methodName);
      if (!tmp.has(pid)) tmp.set(pid, new Map());
      const byObj = tmp.get(pid);
      if (!byObj.has(obj)) byObj.set(obj, new Set());
      byObj.get(obj).add(met);
    }
    this.methodPermission = tmp;
    this.loaded = true;
    return rows.length;
  }

  isAllowed(profileId, objectName, methodName) {
    const obj = this.methodPermission.get(Number(profileId));
    if (!obj) return false;
    const set = obj.get(String(objectName));
    if (!set) return false;
    return set.has(String(methodName));
  }
}

export const Security = new SecurityCache();
