import React from "react";

//include images into your bundle
import TodoList from "./TodoList";

//create your first component


const Home = () => {

	const usuario = 'josepp'

	return (
		<div className="container">
			<h1>Lista de Tareas</h1>
			<div className="row">
				<div className="col m-auto text-start">
					<p>Ejercicio utilizando API:<br />
						<a href="https://playground.4geeks.com/todo/docs" target="_blank">https://playground.4geeks.com/todo/docs</a></p>
				</div>
			</div>
			<TodoList />
		</div >
	);
};

export default Home;