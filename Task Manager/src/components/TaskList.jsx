function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task._id}
          className={task.completed ? "completed" : ""}
          onClick={() => toggleTask(task._id)}
        >
          <span>{task.text}</span>

          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task._id);
            }}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;