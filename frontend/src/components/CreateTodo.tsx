import React, { useState } from 'react';
import api from '../api';

interface CreateTodoProps {
    onTodoCreated: () => void;
}

const CreateTodo: React.FC<CreateTodoProps> = ({ onTodoCreated }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            await api.post('/todos', { title });
            setTitle('');
            onTodoCreated();
        } catch (err) {
            console.error("Failed to create todo", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <input
                type="text"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                disabled={loading}
            >
                Add
            </button>
        </form>
    );
};

export default CreateTodo;
