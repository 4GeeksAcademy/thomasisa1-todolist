import React, { useState, useEffect } from 'react';
import '../../styles/index.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('thomasisa1');

  const API_BASE_URL = `https://playground.4geeks.com/todo`;

  useEffect(() => {
    initializeUser();
  }, []);

  const handleApiError = async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
  };

  const initializeUser = async () => {
    const response = await fetch(`${API_BASE_URL}/users/${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      setTodos(data.todos);
    } else {
      await fetch(`${API_BASE_URL}/users/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    setIsLoading(false);
  };

  const handleAddTodo = async (e) => {
    if ((e.type === 'keypress' && e.key === 'Enter') || e.type === 'click') {
      if (newTodo.trim()) {
        const newTodoItem = { label: newTodo, is_done: false };
        const response = await fetch(`${API_BASE_URL}/todos/${user}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodoItem)
        });
        await handleApiError(response);
        const data = await response.json();
        const updatedTodos = [...todos, data];
        setTodos(updatedTodos);
        setNewTodo('');
      }
    }
  };

  const handleDeleteTodo = async (index) => {
    const todo = todos[index];
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const handleCompleteTodo = async (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, is_done: !todo.is_done } : todo
    );
    setTodos(updatedTodos);
    const todo = updatedTodos.find((todo, i) => i === index);
    await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
  };

  const handleClearAll = async () => {
    const response = await fetch(`${API_BASE_URL}/users/${user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await handleApiError(response);
    setTodos([]);
    await fetch(`${API_BASE_URL}/users/${user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  const activeTodos = todos.filter(todo => !todo.is_done);
  const completedTodos = todos.filter(todo => todo.is_done);

  return (
    <div className="todo-container">
      <h1 className="todo-title">todos</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
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
            {activeTodos.length === 0 ? (
              <li className="todo-empty">No tasks, add a task</li>
            ) : (
              activeTodos.map((todo, index) => (
                <li key={todo.id} className="todo-list-item">
                  <span
                    onClick={() => handleCompleteTodo(todos.indexOf(todo))}
                    className={`todo-check ${todo.is_done ? 'completed' : ''}`}
                  >
                    ✔
                  </span>
                  {todo.label}
                  <button
                    onClick={() => handleDeleteTodo(todos.indexOf(todo))}
                    className="todo-delete-button"
                  >
                    ✖
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="todo-footer">
            {activeTodos.length} item{activeTodos.length !== 1 ? 's' : ''} left
          </div>
          <div className="completed-header">
            <h2 className="completed-title">Completed Tasks ({completedTodos.length})</h2>
            <button className="btn btn-danger btn-clear-all" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
          <ul className="completed-list">
            {completedTodos.length === 0 ? (
              <li className="todo-empty">No completed tasks</li>
            ) : (
              completedTodos.map((todo, index) => (
                <li key={todo.id} className="completed-list-item">
                  {todo.label}
                  <button
                    onClick={() => handleDeleteTodo(todos.indexOf(todo))}
                    className="completed-delete-button"
                  >
                    ✖
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default TodoList;