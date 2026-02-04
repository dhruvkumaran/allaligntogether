import React, { useState, useEffect } from 'react';
import api from '../api';
import CreateTodo from './CreateTodo';
import { useAuth } from '../context/AuthContext';
import { Trash, CheckCircle, Circle, Edit, X, Save } from 'lucide-react';
import clsx from 'clsx';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const { logout } = useAuth();

    const fetchTodos = async () => {
        try {
            const res = await api.get('/todos');
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const toggleComplete = async (todo: Todo) => {
        try {
            const res = await api.put(`/todos/${todo.id}`, { ...todo, completed: !todo.completed });
            setTodos(todos.map(t => t.id === todo.id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const saveEdit = async (id: number) => {
        try {
            const todo = todos.find(t => t.id === id);
            const res = await api.put(`/todos/${id}`, { ...todo, title: editTitle });
            setTodos(todos.map(t => t.id === id ? res.data : t));
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTodos = todos.filter(t => {
        if (filter === 'pending') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    const pendingCount = todos.filter(t => !t.completed).length;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
            </div>

            <CreateTodo onTodoCreated={fetchTodos} />

            <div className="flex gap-4 mb-6 text-sm font-medium text-gray-500 border-b pb-2">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={clsx(
                            "capitalize pb-2 -mb-2 border-b-2 transition-colors",
                            filter === f ? "border-blue-500 text-blue-600" : "border-transparent hover:text-gray-700"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filteredTodos.map(todo => (
                    <div key={todo.id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        {editingId === todo.id ? (
                            <div className="flex items-center flex-1 gap-2">
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="flex-1 p-1 border rounded"
                                    autoFocus
                                />
                                <button onClick={() => saveEdit(todo.id)} className="text-green-600"><Save size={18} /></button>
                                <button onClick={cancelEdit} className="text-gray-500"><X size={18} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center flex-1 gap-3 cursor-pointer" onClick={() => toggleComplete(todo)}>
                                {todo.completed ?
                                    <CheckCircle className="text-green-500" size={24} /> :
                                    <Circle className="text-gray-400 group-hover:text-blue-500" size={24} />
                                }
                                <span className={clsx("text-lg", todo.completed && "text-gray-400 line-through")}>{todo.title}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!editingId && (
                                <>
                                    <button onClick={() => startEdit(todo)} className="text-gray-400 hover:text-blue-600 p-1"><Edit size={18} /></button>
                                    <button onClick={() => deleteTodo(todo.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash size={18} /></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {filteredTodos.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>No {filter} tasks found.</p>
                    </div>
                )}
            </div>

            <div className="mt-6 text-sm text-gray-500">
                You have {pendingCount} pending task{pendingCount !== 1 && 's'}.
            </div>
        </div>
    );
};

export default TodoList;
