const developers = [
  { name: "Alice", skillLevel: 7, maxHours: 40, preferredTaskType: "feature" },
  { name: "Bob", skillLevel: 9, maxHours: 30, preferredTaskType: "bug" },
  {
    name: "Charlie",
    skillLevel: 9,
    maxHours: 35,
    preferredTaskType: "refactor",
  },
];
const tasks = [
  {
    taskName: "Feature A",
    difficulty: 7,
    hoursRequired: 15,
    taskType: "feature",
    priority: 4,
    dependencies: ["Optimization D"],
  },
  {
    taskName: "Bug Fix B",
    difficulty: 5,
    hoursRequired: 10,
    taskType: "bug",
    priority: 5,
    dependencies: [],
  },
  {
    taskName: "Refactor C",
    difficulty: 9,
    hoursRequired: 25,
    taskType: "refactor",
    priority: 3,
    dependencies: ["Bug Fix B"],
  },
  {
    taskName: "Optimization D",
    difficulty: 6,
    hoursRequired: 20,
    taskType: "feature",
    priority: 2,
    dependencies: [],
  },
  {
    taskName: "Upgrade E",
    difficulty: 8,
    hoursRequired: 15,
    taskType: "feature",
    priority: 5,
    dependencies: ["Feature A"],
  },
];

// Function to sort tasks by priority (highest to lowest)
const taskPriority = (tasks) => {
  return tasks.sort((a, b) => b.priority - a.priority);
};

// Function to check if a task is already assigned to a developer
const taskAssign = (developers, task) => {
  let taskAssigned = false;
  developers.map((dev) => {
    if (dev.tasks.some((taskName) => taskName === task.taskName))
      taskAssigned = true;
  });
  return taskAssigned;
};

//function to count the task with most dependencies
const countDependencies = (tasks) => {
  let max = 0;
  tasks.forEach((task) => {
    if (task.dependencies.length > max) max = task.dependencies.length;
  });
  return max;
};

// main function to assign tasks to developers based on priority and dependencies
const assignTasksWithPriorityAndDependencies = (developers, tasks) => {
  // Array to store developers with assigned tasks and hour count
  const asignDevToTask = developers.map((dev) => ({
    devName: dev.name,
    tasks: [],
    totalHours: 0,
  }));

  // Array to store tasks that are not assigned to any developer
  let UnsignedTasks = tasks.map((task) => task.taskName);

  let max = countDependencies(tasks);

  // Sort tasks by priority
  const priorityTasks = taskPriority(tasks);

  for (let i = 0; i <= max; i++) {
    // Loop through the tasks and assign them to developers based on priority, preference, and dependencies
    priorityTasks.forEach((task) => {
      // Check if the task is already assigned to a developer
      if (!taskAssign(asignDevToTask, task)) {
        // Loop through the developers and assign the task to the first developer that meets the requirements
        for (let dev of developers) {
          // Check if the developer meets the requirements | preferred type | skill level | max hours
          if (
            dev.preferredTaskType === task.taskType &&
            dev.skillLevel >= task.difficulty &&
            dev.maxHours >= task.hoursRequired
          ) {
            // Check if the task has dependencies
            if (
              task.dependencies.length === 0 ||
            //   Check if all dependencies are already assigned to a developer
              task.dependencies.every((dep) => !UnsignedTasks.includes(dep))
            ) {
              // Assign the task to the developer
              asignDevToTask.forEach((devTask) => {
                if (devTask.devName === dev.name) {
                  devTask.tasks.push(task.taskName);
                  devTask.totalHours += task.hoursRequired;
                  dev.maxHours -= task.hoursRequired; 
                  UnsignedTasks = UnsignedTasks.filter(
                    (unsignedTask) => unsignedTask !== task.taskName
                  );
                }
              });
              break;
            }
          }
        }
      }
    });
  }

  
//   asignDevToTask.map((dev) => {
//     if (UnsignedTasks.some((task) => dev.tasks.includes(task))) {
//       dev.tasks.map((task) => {
//         UnsignedTasks = UnsignedTasks.filter(
//           (unsignedTask) => unsignedTask !== task
//         );
//       });
//     }
//   });
  return [asignDevToTask, UnsignedTasks];
};

console.log(assignTasksWithPriorityAndDependencies(developers, tasks));
