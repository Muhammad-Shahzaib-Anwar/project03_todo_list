#!/usr/bin/env node
import inquirer from 'inquirer';

interface Todo {
  task: string;
  completed: boolean;
}

let todos: Todo[] = [];

async function promptForAction(): Promise<string> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Add a task', 'View tasks', 'Mark task as complete', 'Exit'],
    },
  ]);

  return action;
}

async function promptForTask(): Promise<string | null> {
  const { task } = await inquirer.prompt([
    {
      type: 'input',
      name: 'task',
      message: 'Enter the task description (or type "exit" to cancel):',
    },
  ]);

  if (task.toLowerCase() === 'exit') {
    return null;
  }

  return task;
}

async function promptForTaskCompletion(): Promise<number[] | null> {
  if (todos.length === 0) {
    console.log('No tasks to complete.');
    return null;
  }

  const choices = todos.map((todo, index) => ({
    name: todo.task,
    value: index,
    checked: todo.completed,
  }));

  const { taskIndices } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'taskIndices',
      message: 'Select the task(s) to mark as complete:',
      choices,
    },
  ]);

  return taskIndices.length > 0 ? taskIndices : null;
}

function viewTasks() {
  if (todos.length === 0) {
    console.log('No tasks in the list.');
  } else {
    todos.forEach((todo, index) => {
      console.log(`${index + 1}. [${todo.completed ? 'x' : ' '}] ${todo.task}`);
    });
  }
}

async function runTodoList() {
  console.log('Welcome to the To-Do List Manager!');

  while (true) {
    const action = await promptForAction();

    if (action === 'Add a task') {
      const task = await promptForTask();
      if (task !== null) {
        todos.push({ task, completed: false });
        console.log('Task added.');
      }
    } else if (action === 'View tasks') {
      viewTasks();
    } else if (action === 'Mark task as complete') {
      const taskIndices = await promptForTaskCompletion();
      if (taskIndices !== null) {
        taskIndices.forEach(index => {
          todos[index].completed = true;
        });
        console.log('Task(s) marked as complete.');
      }
    } else if (action === 'Exit') {
      console.log('Exiting the to-do list manager. Goodbye!');
      break;
    }
  }
}

runTodoList().catch(error => {
  console.error('An error occurred:', error);
});
