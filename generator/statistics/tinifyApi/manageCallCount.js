const path = require('path');
const fs = require('fs');

function hasFreeApiCalls(numRequests) {
    const { STARTED_COUNT_AT, COUNT, CYCLE_LENGTH, MAX_FREE_CALLS } = require('./callCount');
    let updatedStart = STARTED_COUNT_AT;
    let updatedCount = COUNT;
    const timeSinceCountStart = Date.now() - STARTED_COUNT_AT;
    if (timeSinceCountStart > CYCLE_LENGTH) {
        updatedStart = Date.now();
        updatedCount = 0;
    }
    writeCallCount({
        STARTED_COUNT_AT: updatedStart,
        CYCLE_LENGTH,
        COUNT: updatedCount,
        MAX_FREE_CALLS
    });
    const numFreeApiCalls = MAX_FREE_CALLS - updatedCount;
    const nextFreeMonthStart = new Date(STARTED_COUNT_AT + CYCLE_LENGTH);
    if (numRequests > numFreeApiCalls) {
        console.log(`Number of estimated api calls (${numRequests}) exceeds number of free api calls (${numFreeApiCalls}) left before ${nextFreeMonthStart}\n`);
        return false;
    }
    return true;
}

function addCallCount(numCalls) {
    const { STARTED_COUNT_AT, COUNT, CYCLE_LENGTH, MAX_FREE_CALLS } = require('./callCount');
    const updatedCount = COUNT + numCalls;
    const nextFreeMonthStart = new Date(STARTED_COUNT_AT + CYCLE_LENGTH);
    console.log(`\nYou have ${MAX_FREE_CALLS - updatedCount} api calls left until ${nextFreeMonthStart}\n`);
    writeCallCount({
        STARTED_COUNT_AT,
        CYCLE_LENGTH,
        COUNT: updatedCount,
        MAX_FREE_CALLS
    });
}

function writeCallCount(callCount) {
    fs.writeFileSync(path.resolve('callCount.json'), JSON.stringify(callCount, null, 4));
}

exports.hasFreeApiCalls = hasFreeApiCalls;
exports.addCallCount = addCallCount;