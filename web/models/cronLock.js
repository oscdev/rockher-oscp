import { dbCronLock } from "./index.js";

export const modelCronLock = {

 checkLock: async function (schedule) {
	return await dbCronLock.checkLock(schedule);
  },

 acquireLock: async function(schedule) {
	return await dbCronLock.acquireLock(schedule);
  },

  releaseLock: async function(schedule) {
	return await dbCronLock.releaseLock(schedule);
  }
}