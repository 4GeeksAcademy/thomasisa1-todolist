

import React, { useState, useEffect } from 'react';
import '../../styles/index.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState('thomasisa1');

  const API_URL = `https://playground.4geeks.com/todo/users/${user}`;

  useEffect(() => {
    createUser();
  }, []);

  const createUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([]) // Creating an empty todo list for the user
      });
      if (response.ok) {
        fetchTodos();
      } else {
        console.log('Error: ', response.status, response.statusText);
      }
    } catch (error) {
      console.log('Error creating user:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.log('Error fetching tasks:', await response.text());
      }
    } catch (error) {
      console.log('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodoToServer = async (newTodoItem) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodoItem)
      });
      if (response.ok) {
        const createdTodo = await response.json();
        return createdTodo;
      } else {
        console.log('Error adding task:', await response.text());
        return null;
      }
    } catch (error) {
      console.log('Error adding task:', error);
      return null;
    }
  };

  const syncTodos = async (updatedTodos) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodos)
      });
      if (!response.ok) {
        console.log('Error syncing tasks:', await response.text());
      }
    } catch (error) {
      console.log('Error syncing tasks:', error);
    }
  };

  const handleAddTodo = async (e) => {
    if ((e.type === 'keypress' && e.key === 'Enter') || e.type === 'click') {
      if (newTodo.trim()) {
        const newTodoItem = { label: newTodo, is_done: false };
        const createdTodo = await addTodoToServer(newTodoItem);
        if (createdTodo) {
          const updatedTodos = [...todos, createdTodo];
          setTodos(updatedTodos);
          setNewTodo('');
          await syncTodos(updatedTodos);
        }
      }
    }
  };

  const handleDeleteTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    await syncTodos(updatedTodos);
  };

  const handleCompleteTodo = async (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, is_done: !todo.is_done } : todo
    );
    setTodos(updatedTodos);
    await syncTodos(updatedTodos);
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setTodos([]);
      } else {
        console.log('Error clearing tasks:', await response.text());
      }
    } catch (error) {
      console.log('Error clearing tasks:', error);
    }
  };

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
            {todos.length === 0 ? (
              <li className="todo-empty">No tasks, add a task</li>
            ) : (
              todos.map((todo, index) => (
                <li key={todo.id} className="todo-list-item">
                  <span
                    onClick={() => handleCompleteTodo(index)}
                    className={`todo-check ${todo.is_done ? 'completed' : ''}`}
                  >
                    ✔
                  </span>
                  {todo.label}
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
          <div className="completed-header">
            <h2 className="completed-title">Completed Tasks</h2>
            <button className="btn btn-danger btn-clear-all" onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoList;