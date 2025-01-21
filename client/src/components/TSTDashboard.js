import React, { useState, useEffect } from 'react';
import './Style.css';
import { useNavigate } from 'react-router-dom';

function TSTDashboard() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [newBug, setNewBug] = useState({
        description: '',
        severity: 'Low',
        priority: 'Low',
        commitLink: '',
    });
    const [showBugForm, setShowBugForm] = useState(false);
    const token = localStorage.getItem('token');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError('Failed to fetch projects');
        }
    };

    const fetchBugs = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/bugs/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch bugs');
            const data = await response.json();
            setBugs(data);
        } catch (err) {
            setError('Failed to fetch bugs');
        }
    };

    const handleSelectProject = (projectId) => {
        setSelectedProject(projectId);
        fetchBugs(projectId);
    };

    const handleAddBug = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/bugs', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newBug,
                    projectId: selectedProject,
                    assignedTo: null,
                }),
            });
            if (!response.ok) throw new Error('Failed to add bug');
            setNewBug({
                description: '',
                severity: 'Low',
                priority: 'Low',
                commitLink: ''
            });
            setShowBugForm(false);
            fetchBugs(selectedProject);
        } catch (err) {
            setError('Failed to add bug');
        }
    };

    const handleCancelAddBug = () => {
        setShowBugForm(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (showBugForm) {
        return (
            <div className="dashboard-container">
                <h1>TST Dashboard</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <div className="form">
                    <h3>Add a bug</h3>
                    <form>
                        <label>Description</label>
                        <textarea
                            value={newBug.description}
                            onChange={(e) => setNewBug({
                                ...newBug,
                                description:
                                    e.target.value
                            })}
                            required
                        />
                        <div>
                            <label>Severity</label>
                            <select
                                value={newBug.severity}
                                onChange={(e) => setNewBug({
                                    ...newBug,
                                    severity: e.target.value
                                })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label>Priority</label>
                            <select
                                value={newBug.priority}
                                onChange={(e) => setNewBug({
                                    ...newBug,
                                    priority: e.target.value
                                })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label>Commit link</label>
                            <input
                                type="text"
                                value={newBug.commitLink}
                                onChange={(e) => setNewBug({
                                    ...newBug,
                                    commitLink: e.target.value
                                })}
                            />
                        </div>
                        <button type="button" onClick={handleAddBug}>Add bug</button>
                        <button type="button" onClick={handleCancelAddBug}>Cancel</button>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            <div className="dashboard-container">
                <h1>TST Dashboard</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <div className="dashboard-content">
                    <div className="dashboard-section sectionleft">
                        <h2>Projects</h2>
                        <ul>
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <button onClick={() => handleSelectProject(project.id)}>
                                        {project.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="dashboard-section sectionright">
                        <h2>Bugs for project {selectedProject}</h2>
                        {selectedProject && (
                            <button onClick={() => setShowBugForm(true)} >
                                Add bug
                            </button>
                        )}
                        <ul>
                            {bugs.map((bug) => (
                                <li key={bug.id}>
                                    <p><strong>Description:</strong> {bug.description}</p>
                                    <p><strong>Severity:</strong> {bug.severity}</p>
                                    <p><strong>Priority:</strong> {bug.priority}</p>
                                    <p><strong>Status:</strong> {bug.status}</p>
                                    <p><strong>Commit Link:</strong> <a href={bug.commitLink}>{bug.commitLink}</a></p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default TSTDashboard;
