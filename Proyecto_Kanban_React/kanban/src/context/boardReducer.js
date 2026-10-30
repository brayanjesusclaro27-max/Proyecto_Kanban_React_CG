export function reducer(state, action) {
  switch (action.type) {
    case "set":
      return action.tasks;
    case "add":
      return [...state, action.task];
    case "move":
      return state.map((task) =>
        task.id === action.id ? { ...task, status: action.status } : task
      );
    case "edit":
      return state.map((task) =>
        task.id === action.id
          ? { ...task, title: action.title, priority: action.priority }
          : task
      );
    case "remove":
      return state.filter((task) => task.id !== action.id);
    default:
      return state;
  }
}
