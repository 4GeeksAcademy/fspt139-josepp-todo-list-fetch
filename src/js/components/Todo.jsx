import React from 'react';

const Todo = ({ tarea, onDelete }) => {


  return (
    (tarea ?
      <li className="tarea">
        <span className="todo-text">{tarea}</span>
        <button
          className="borrar-btn"
          onClick={onDelete}
        >🗑️</button>
      </li>
      :
      <li className="todoEmpty">No hay tareas, añade una nueva</li>
    )
  );
};

export default Todo