import React from 'react';

const Todo = ({ tarea, onDelete, onComplete }) => {

  


  return (
    (tarea ?
      <li className="tarea">
        <span className="todo-text">{tarea}</span>
        {((onComplete) ?
          <button
            className="complete-btn"
            onClick={onComplete}
          >✅</button>
          : '')
        }
        {((onDelete) ?
          <button
            className="borrar-btn"
            onClick={onDelete}
          >🗑️</button>
          : '')
        }
      </li>
      :
      <li className="todoEmpty">No hay tareas pendientes, añade una nueva</li>
    )
  );
};

export default Todo