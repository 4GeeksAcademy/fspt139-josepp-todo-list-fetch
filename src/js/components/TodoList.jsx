import React, { useState, useEffect } from 'react';
import Todo from './Todo';


const TodoList = () => {

    const [user, setUser] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const [tareas, setTareas] = useState([
        {
            "id": '',
            "label": '',
            "is_done": ''
        }

    ])
    const [isRegistered, setIsRegistered] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    const [tareasCompletadas, setTareasCompletadas] = useState([])

    useEffect(() => {
        recuperarTareas()
    }, [])

    const registrarUsuario = async () => {
        try {

            const prompted_user = prompt('Escribe tu nombre de usuario para acceder')
            setUser(prompted_user)
            const response = await fetch(`https://playground.4geeks.com/todo/users/${prompted_user}`, {
                method: 'POST'
            })
            const data = await response.json()
            if (!response.ok) {
                const errorCode = response.status
                if (errorCode !== 400) {
                    throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
                }
            }
            recuperarTareas(prompted_user)
        } catch (_error) {
            setErrorMessage(_error.message || 'Error no identificado')
        }
    }

    const recuperarTareas = async (nombreUsuario) => {
        let listaTareas = []
        let usuario = nombreUsuario || user;

        if (usuario) {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
                }

                setIsRegistered(true)
                const _tareasPendientes = data.todos.filter(t => t.is_done === false);
                const _tareasCompletadas = data.todos.filter(t => t.is_done === true);
                setTareas(_tareasPendientes);
                setTareasCompletadas(_tareasCompletadas);

            } catch (_error) {
                setErrorMessage(_error.message || 'Error no identificado')
            }

        }
    }

    const crearNuevaTarea = async (e) => {

        if (e.keyCode === 13 && inputValue.trim() !== '') {

            const nuevaTarea = {
                id: null,
                label: inputValue.trim(),
                is_done: false
            };

            //revision con try/catch
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
                    method: "POST",
                    body: JSON.stringify(nuevaTarea),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
                }

                recuperarTareas();
                setInputValue('');

            } catch (_error) {
                setErrorMessage(_error.message || 'Error no identificado')
            }

        }
    }

    const borrarTarea = async (borrar_id) => {

        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${borrar_id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
            }
            recuperarTareas()

        } catch (_error) {
            //console.log(_error)
            setErrorMessage(_error.message || 'Error no identificado')
        }

    }

    const completarTarea = async (tarea_id) => {
        try {
            const tareaActualizada = {
                is_done: true
            };
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tarea_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tareaActualizada)
            });
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
            }

            recuperarTareas()

        } catch (_error) {
            setErrorMessage(_error.message || 'Error no identificado')
        }
    }

    const removeUsuario = async (usuario) => {

        try {
            // let usuario = e.target.name
            if (usuario) {
                if (confirm(`Te dispones a eliminar todos los datos y tareas del usuario ${user}\n¿Continuar?`)) {
                    const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
                        method: 'DELETE'
                    })

                    //  const data = await response.json()
                    /* if (!response.ok) {
                         throw new Error(data.detail ? `${response.status} ${data.detail}` : 'Error no identificado');
                     }*/

                    setUser('')
                    setIsRegistered(false)
                    setErrorMessage('')
                }

            }
        } catch (_error) {
            setErrorMessage(_error.message || 'Error no identificado')
        }
    }


    return (

        <>
            {(errorMessage) && (<div className="alert alert-danger m-4" role="alert">{errorMessage}</div>)}

            {(!isRegistered) ?
                (
                    <div className="card col-md-8 m-auto my-5 p-4">
                        <div className="card-body">
                            <p className="card-text">Tu usuario todavía no está identificado en el sistema, haz clic en "Registrar usuario" para completar el registro y empezar a guardar tareas en tu lista de tareas</p>
                            <button className="btn btn-primary" onClick={registrarUsuario}>Registrar usuario</button>
                        </div>
                    </div>
                ) :
                (
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
                                            key={tarea.id}
                                            tarea={tarea.label}
                                            onDelete={() => borrarTarea(tarea.id)}
                                            onComplete={() => completarTarea(tarea.id)}
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
                                            key={tarea.id}
                                            tarea={tarea.label}
                                        />
                                    ))
                                }
                            </ul>
                        </div>


                        <div className="todoFooter d-flex justify-content-between">
                            <div>
                                {tareas.length} {tareas.length !== 1 ? 'tareas pendientes' : 'tarea pendiente'}
                            </div>
                            <div>
                                <button className='btn btn-secondary btn-sm' onClick={() => removeUsuario(user)}>Eliminar usuario {user} y {tareas.length + tareasCompletadas.length} tareas</button>
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    )
}
export default TodoList

