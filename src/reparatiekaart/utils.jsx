let repairIDCounter = {}; // In-memory object to store counters for each year

export function generateRepairID() {
    const now = new Date();
    const year = now.getFullYear();

    // If there isn't a counter for the current year, initialize it to 1
    if (!repairIDCounter[year]) {
        repairIDCounter[year] = 1;
    }

    // Get the current counter and increment it
    const currentCounter = String(repairIDCounter[year]).padStart(3, '0');
    repairIDCounter[year]++;

    return `REP-${year}-${currentCounter}`;
}