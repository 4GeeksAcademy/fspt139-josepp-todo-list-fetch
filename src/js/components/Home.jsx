import React from "react";

//include images into your bundle
import TodoList from "./TodoList";

//create your first component


const Home = () => {
	return (
		<div className="container">
			<h1>Lista de Tareas</h1>
			<TodoList />
		</div>
	);
};

export default Home;