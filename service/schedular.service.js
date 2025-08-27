import { refreshSportData, refreshAllEventList } from "./redis-fetch-data.service.js";

export async function initSchedulersFetchData() {
  console.log("Scheduler for FETCH SPORT DATA started...");

  // Recursive function to handle scheduling after previous run completes
  async function run() {
    try {
      console.log("Updating Betfair FETCH SPORT DATA...");
      await refreshSportData(); 
    //   await refreshAllEventList()
    } catch (err) {
      console.error("Scheduler failed to refresh Betfair FETCH SPORT DATA:", err.message);
    }

    // Schedule the next run 3 minutes after this one finishes
    setTimeout(run, 10 * 1000);
  }

  // Start the first run
  run();
}