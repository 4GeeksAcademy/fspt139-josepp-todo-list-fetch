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
        const prompted_user = prompt('Escribe tu nombre de usuario para acceder')
        setUser(prompted_user)
        const response = await fetch(`https://playground.4geeks.com/todo/users/${prompted_user}`, {
            method: 'POST'
        })
        let isOk = true
        //console.log(response)
        const data = await response.json()
        //console.log(data)
        if (!response.ok) {
            const errorCode = response.status
            if (errorCode !== 400) {
                let _error = 'Error al registrar usuario'
                if (data.detail) {
                    _error = errorCode + ' ' + data.detail
                }
                setErrorMessage(_error)
                isOk = false
            }
        }
        //        console.log(isOk)
        if (isOk) {
            recuperarTareas(prompted_user)
        }
    }

    const recuperarTareas = async (nombreUsuario) => {
        let listaTareas = []
        let usuario = nombreUsuario || user;

        if (usuario) {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`)
            //console.log(response)
            const data = await response.json()
            //console.log(data)
            if (!response.ok) {
                const errorCode = response.status
                let _error = 'Error no identificado'
                if (data.detail) {
                    _error = errorCode + ' ' + data.detail
                }
                setErrorMessage(_error)
            } else {
                setIsRegistered(true)

                const _tareasPendientes = data.todos.filter(t => t.is_done === false);
                const _tareasCompletadas = data.todos.filter(t => t.is_done === true);
                setTareas(_tareasPendientes);
                setTareasCompletadas(_tareasCompletadas);
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

            //consultar/explicar diferencia y acceso a response desde el then
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
                method: "POST",
                body: JSON.stringify(nuevaTarea),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    //console.log(resp.ok); 
                    //console.log(resp.status); 

                    const data = resp.json()
                    if (!resp.ok) {
                        let _error = 'Error no identificado'
                        if (data.detail) {
                            _error = resp.status + ' ' + data.detail
                        }
                        setErrorMessage(_error)
                        setErrorMessage("Error al crear la tarea");
                        //abortar funcion
                        return
                    }
                    return data;
                })
                .then(data => {
                    if (data) {
                        //console.log('then')
                        recuperarTareas();
                        setInputValue('');
                    }
                })
                .catch(error => {
                    console.log(error)
                });


            /*

            const response = await fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaTarea)
            });

            if (response.ok) {
                recuperarTareas();
                setInputValue('');
            } else {
                const data = await response.json()
                const errorCode = response.status
                let _error = 'Error no identificado'
                if (data.detail) {
                    _error = errorCode + ' ' + data.detail
                }
                setErrorMessage(_error)
                setErrorMessage("Error al crear la tarea");
            }
                */
            //setTareas([...tareas, inputValue.trim()])
            //setInputValue('')
        }
    }

    const borrarTarea = async (borrar_id) => {
        let isOk = true
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${borrar_id}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            const data = await response.json()
            const errorCode = response.status
            let _error = 'Error al eliminar tarea'
            if (data.detail) {
                _error = errorCode + ' ' + data.detail
            }
            setErrorMessage(_error)
            isOk = false
        }
        //console.log(isOk)
        if (isOk) {
            recuperarTareas()
        }

    }

    const completarTarea = async (tarea_id) => {
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

        if (response.ok) {
            recuperarTareas()
        } else {
            const data = await response.json()
            let _error = 'Error al actualizar la tarea'
            if (data.detail) {
                _error = errorCode + ' ' + data.detail
            }
            setErrorMessage(_error)
        }
    }
    /*
    const completarTarea = (agregar_index) => {
        let _completada = tareas.filter((nombre, index) => index == agregar_index)
        setTareasCompletadas([...tareasCompletadas, _completada])
        setTareas(tareas.filter((nombre, index) => index !== agregar_index))
    }*/

    const removeUsuario = async (e) => {

        let usuario = e.target.name
        if (usuario) {
            if (confirm(`Te dispones a eliminar todos los datos y tareas del usuario ${user}\n¿Continuar?`)) {
                const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
                    method: 'DELETE'
                })
                setUser('')
                setIsRegistered(false)
            }
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
                                <button className='btn btn-secondary btn-sm' onClick={removeUsuario} name={user}>Eliminar usuario {user} y {tareas.length + tareasCompletadas.length} tareas</button>
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    )
}
export default TodoList

