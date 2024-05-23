import React, { useState } from 'react';
import '/src/styles/index.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e) => {
    if ((e.type === 'keypress' && e.key === 'Enter') || e.type === 'click') {
      if (newTodo.trim()) {
        setTodos([...todos, newTodo]);
        setNewTodo('');
      }
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleCompleteTodo = (index) => {
    const completedTask = todos[index];
    setCompletedTodos([...completedTodos, completedTask]);
    handleDeleteTodo(index);
  };

  const handleDeleteCompletedTodo = (index) => {
    const updatedCompletedTodos = completedTodos.filter((_, i) => i !== index);
    setCompletedTodos(updatedCompletedTodos);
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">todos</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleAddTodo}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="todo-add-button">Add</button>
      </div>
      <ul className="todo-list">
        {todos.length === 0 ? (
          <li className="todo-empty">No tasks, add a task</li>
        ) : (
          todos.map((todo, index) => (
            <li key={index} className="todo-list-item">
              <span onClick={() => handleCompleteTodo(index)} className="todo-check">✔</span>
              {todo}
              <button
                onClick={() => handleDeleteTodo(index)}
                className="todo-delete-button"
              >
                ✖
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="todo-footer">
        {todos.length} item{todos.length !== 1 ? 's' : ''} left
      </div>
      <h2 className="completed-title">Completed Tasks</h2>
      <ul className="completed-list">
        {completedTodos.length === 0 ? (
          <li className="todo-empty">No completed tasks</li>
        ) : (
          completedTodos.map((todo, index) => (
            <li key={index} className="completed-list-item">
              {todo}
              <button
                onClick={() => handleDeleteCompletedTodo(index)}
                className="completed-delete-button"
              >
                ✖
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TodoList;