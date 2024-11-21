const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

const filepath = path.join(__dirname, 'task.txt');

const getInput = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}

async function addTask() {
    let task = await getInput('Enter the new task: ');
    try {
        await fs.appendFile(filepath, `${task}\n`, 'utf8');
        console.log(`Task added: "${task}"`);
    } catch (err) {
        console.error('Error adding task:', err);
    }
    showMenu();
}

async function viewTask() {
    try {
        let data = await fs.readFile(filepath, 'utf8');
        const tasks = data.trim().split('\n');
        if (tasks.length > 0) {
            console.log("\nTasks:");
            tasks.map((task, index) => {
                console.log(`${index + 1}. ${task}`);
            });
        } else {
            console.log("No tasks available!!!");
        }
    } catch (err) {
        console.error('Error reading tasks:', err);
    }

    showMenu();
}

async function markTask(){
    try{
        let data = await fs.readFile(filepath, 'utf8');
        let tasks = data.trim().split('\n');
        if(tasks.length > 0){
            let taskNumber = await getInput("Enter the task number: ");
            taskNumber = parseInt(taskNumber);
            if(taskNumber > 0 && taskNumber <= tasks.length){
                tasks[taskNumber - 1] = `[${tasks[taskNumber - 1]} complete]`
                await fs.writeFile(filepath, tasks.join('\n'), 'utf8');
                console.log(`Task ${taskNumber} marked as complete.`);
            } else {
                console.log('Invalid task number.');
            }
        }
        else{
            console.log("No  tasks available !!!");
        }
    }
    catch(err){
        console.error(err);
    }
    showMenu();
}

async function removeTask() {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        let tasks = data.trim().split('\n');
        if (tasks.length > 0) {
            let taskNumber = await getInput('Enter task number to remove: ');
            taskNumber = parseInt(taskNumber);

            if (taskNumber > 0 && taskNumber <= tasks.length) {
                // const removedTask = tasks[taskNumber - 1];
                // tasks = tasks.filter((_,index) => index !== (taskNumber - 1));
                const removedTask = tasks.splice(taskNumber - 1, 1);
                await fs.writeFile(filepath, tasks.join('\n'), 'utf8');
                console.log(`Task removed: "${removedTask}"`);
            } else {
                console.log('Invalid task number.');
            }
        } else {
            console.log('No tasks available to remove.');
        }
    } catch (err) {
        console.error('Error removing task:', err);
    }
    showMenu();
}


async function showMenu() {
    console.log('\nTask Manager');
    console.log('1. Add a new task');
    console.log('2. View tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');

    let choice = await getInput('\nChoose an option:');
    switch (choice) {
        case '1':
            await addTask();
            break;
        case '2':
            await viewTask();
            break;
        case '3':
            await markTask();
            break;
        case '4':
            await removeTask();
            break;
        case '5':
            console.log("Exiting Task Manager");
            break;
        default:
            console.log('Invalid option.');
            showMenu();
            break;
    }
}

showMenu();
