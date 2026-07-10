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
        let _completada = tareas.filter((nombre, index) => index == agregar_index)
        setTareasCompletadas([...tareasCompletadas, _completada])
        setTareas(tareas.filter((nombre, index) => index !== agregar_index))
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

            <div className='mt-4'>
                <h2 className='ps-5'>🗓️ Pendientes</h2>
                <ul className="todoList">
                    {tareas.length === 0 ? (
                        <Todo />
                    ) : (
                        tareas.map((tarea, index) => (
                            <Todo
                                key={index}
                                tarea={tarea}
                                onDelete={() => borrarTarea(index)}
                                onComplete={() => completarTarea(index)}
                            />
                        ))
                    )}
                </ul>
            </div>
            <hr />
            <div className='mb-4'>
                <h2 className='ps-5 text-success'>✔ Completadas</h2>
                <ul className="doneList">
                    {
                        (tareasCompletadas.length !== 0) &&
                        tareasCompletadas.map((tarea, index) => (
                            <Todo
                                key={index}
                                tarea={tarea}
                            />
                        ))
                    }
                </ul>
            </div>

            <div className="todoFooter">
                {tareas.length} {tareas.length !== 1 ? 'tareas pendientes' : 'tarea pendiente'}
            </div>
        </div >

    )
}
export default TodoList

