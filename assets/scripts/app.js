const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 17;
const PLAYER_HEAL_VALUE = 20;
const MONSTER_ATTACK_VALUE = 14;

// Global identifiers
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_END_GAME = 'END_GAME';

let chosenMaxLife, currentPlayerHealth, currentMonsterHealth, hasBonusLife = true,
    battleLogs = [],
    lastLogIndex;

function takeUserInput() {
    let userInput = parseInt(prompt('Choose a max life for you and monster', '100'));
    if (!userInput || userInput <= 0) {
        throw {
            message: 'Entered value is not a valid number'
        };
    }
    return userInput;
}

try {
    chosenMaxLife = takeUserInput();
    // console.log('Yo yo honey singh!');
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    // throw 'Hello';
} finally {
    // console.log('Code in finally');
}

// console.log('Code outside of try-catch-finally');

function reset() {
    resetGame(chosenMaxLife);
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
}

function writeToLog(event, value, playerHealth, monsterHealth) {
    let eventLog = {
        event: event,
        value: value,
        finalPlayerHealth: playerHealth,
        finalMonsterHealth: monsterHealth
    };
    // if (event === LOG_EVENT_PLAYER_ATTACK) {
    //     eventLog.target = 'MONSTER';
    // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     eventLog.target = 'MONSTER';
    // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    //     eventLog.target = 'PLAYER';
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     eventLog.target = 'PLAYER';
    // }

    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            eventLog.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            eventLog.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            eventLog.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            eventLog.target = 'PLAYER';
            break;
    }

    battleLogs.push(eventLog);
}

function printLogs() {
    // for(let i = 0 ; i < battleLogs.length ; i++) {
    //     console.log(battleLogs[i]);
    // }

    // let i = 0;
    // while(i < battleLogs.length){
    //     console.log(battleLogs[i]);
    //     i++;
    // }

    // do {
    //     console.log(battleLogs[i]);
    //     i++;
    // } while(i < battleLogs.length);

    let i = 0;
    for (const eventLog of battleLogs) {
        if (!lastLogIndex && lastLogIndex !== 0 || lastLogIndex < i) {
            console.log(`#${i}`);
            for (const key in eventLog) {
                console.log(`${key} => ${eventLog[key]}`);
            }
            lastLogIndex = i;
        }
        i++;
    }
}

function monsterReplyAndGameStatus() {
    let previousPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentPlayerHealth, currentMonsterHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        removeBonusLife();
        setPlayerHealth(previousPlayerHealth);
        currentPlayerHealth = previousPlayerHealth;
        hasBonusLife = false;
        alert('Your bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(LOG_EVENT_END_GAME, 'PLAYER WON', currentPlayerHealth, currentMonsterHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(LOG_EVENT_END_GAME, 'MONSTER WON', currentPlayerHealth, currentMonsterHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeToLog(LOG_EVENT_END_GAME, 'A DRAW', currentPlayerHealth, currentMonsterHealth);
    }

    if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
        reset();
    }
}

function performAttack(mode) {
    let attackValue = mode === MODE_ATTACK ? PLAYER_ATTACK_VALUE : PLAYER_STRONG_ATTACK_VALUE;
    let logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    // if (mode === MODE_ATTACK) {
    //     attackValue = PLAYER_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else if (mode === MODE_STRONG_ATTACK) {
    //     attackValue = PLAYER_STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

    if (!attackValue) {
        return;
    }

    const monsterDamage = dealMonsterDamage(attackValue);
    currentMonsterHealth -= monsterDamage;

    writeToLog(logEvent, monsterDamage, currentPlayerHealth, currentMonsterHealth);

    monsterReplyAndGameStatus();
}

function attackHandler() {
    performAttack(MODE_ATTACK);
}

function strongAttackHandler() {
    performAttack(MODE_STRONG_ATTACK);
}

function healHandler() {
    let playerHealValue;
    if (currentPlayerHealth > chosenMaxLife - PLAYER_HEAL_VALUE) {
        playerHealValue = chosenMaxLife - currentPlayerHealth;
        alert('Your health can\'t be healed beyond chosen max life');
    } else {
        playerHealValue = PLAYER_HEAL_VALUE;
    }
    increasePlayerHealth(playerHealValue);
    currentPlayerHealth += playerHealValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, playerHealValue, currentPlayerHealth, currentMonsterHealth);
    monsterReplyAndGameStatus();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healHandler);
logBtn.addEventListener('click', printLogs);

adjustHealthBars(chosenMaxLife);
reset();