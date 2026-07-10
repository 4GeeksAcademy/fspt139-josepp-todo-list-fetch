import React, { useState } from 'react';
import Todo from './Todo';


const TodoList = () => {

    const [inputValue, setInputValue] = useState('')
    const [tareas, setTareas] = useState([])

    const [tareasCompletadas, setTareasCompletadas] = useState([])


    const crearNuevaTarea = (e) => {
        if (e.keyCode === 13 && inputValue.trim() !== '') {
            setTareas([...tareas, inputValue.trim()])
            setInputValue('')
        }
    }

    const borrarTarea = (borrar_index) => {
        setTareas(tareas.filter((nombre, index) => index !== borrar_index))
    }

    const completarTarea = (agregar_index) => {
        setTareas(tareas.filter((nombre, index) => index !== borrar_index))
        setTareas(tareas.filter((nombre, index) => index !== borrar_index))
    }

    return (
        <div className="todo-card">
            <input
                type="text"
                className="input"
                placeholder="¿Qué quieres añadir?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyUp={crearNuevaTarea}
            />

            <ul className="todoList">
                {tareas.length === 0 ? (
                    <Todo/>                   
                ) : (
                    tareas.map((tarea, index) => (                        
                        <Todo
                            key={index}
                            tarea={tarea}
                            onDelete={() => borrarTarea(index)}
                        />
                    ))
                )}
            </ul>

            <div className="todoFooter">
                {tareas.length} {tareas.length !== 1 ? 'tareas pendientes' : 'tarea pendiente'}
            </div>
        </div>

    )
}
export default TodoList

