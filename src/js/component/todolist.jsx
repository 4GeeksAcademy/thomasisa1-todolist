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
  if(response.ok){
    const data = await response.json()
    setTodos(data.todos)
  }
  else{
    const response = await fetch(`${API_BASE_URL}/users/${user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  setIsLoading(false)
}
  // const initializeUser = async () => {
  //   try {
  //     await fetchTodos();
  //   } catch (error) {
  //     if (error.message.includes('404')) {
  //       await createUser();
  //     } else {
  //       console.error('Error initializing user:', error);
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const createUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user,
          todos: []
        })
      });
      await handleApiError(response);
      await fetchTodos();
    } catch (error) {
      console.error('Error creating user:', error);
      setIsLoading(false);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${users}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await handleApiError(response);
      const data = await response.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error; // rethrow to catch in initializeUser
    } finally {
      setIsLoading(false);
    }
  };

  // const syncTodos = async (updatedTodos) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/${user}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(updatedTodos)
  //     });
  //     await handleApiError(response);
  //   } catch (error) {
  //     console.error('Error syncing tasks:', error);
  //   }
  // };

  const handleAddTodo = async (e) => {
    if ((e.type === 'keypress' && e.key === 'Enter') || e.type === 'click') {
      if (newTodo.trim()) {
        const newTodoItem = { label: newTodo, is_done: false };
        const response = await fetch(`${API_BASE_URL}/todos/${user}`, {
          method: 'POST', 
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(newTodoItem)
        });
        const data = await response.json();
        const updatedTodos = [...todos, data];
        setTodos(updatedTodos);
        setNewTodo('');
      }
    }
  };

  const handleDeleteTodo = async (index) => {
    let todo = todos[index]
    setTodos(todos.toSpliced(index,1))
    const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: 'DELETE', 
      headers:{'Content-Type':'application/json'},
    });

  };

  const handleCompleteTodo = async (index) => {
    let todo = todos[index]
    todo.is_done = true
    setTodos(todos.toSpliced(index,1,todo))
    const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
      method: 'PUT', 
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(todo)
    });
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await handleApiError(response);
      setTodos([]);
      await createUser(); // Recreate user with an empty list after clearing
    } catch (error) {
      console.error('Error clearing tasks:', error);
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
                <li key={index} className="todo-list-item">
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