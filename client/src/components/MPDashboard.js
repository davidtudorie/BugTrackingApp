import React, { useState, useEffect } from 'react';
import './Style.css';
import { useNavigate } from 'react-router-dom';

function MPDashboard() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    repository: ''
  });
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectBugs, setProjectBugs] = useState([]);
  const [assignedBugs, setAssignedBugs] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [bugStatus, setBugStatus] = useState({
  });
  const token = localStorage.getItem('token');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchUserProjects();
    fetchAssignedBugs();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok)
        throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/projects/user-projects', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok)
        throw new Error('Failed to fetch user projects');
      const data = await response.json();
      setUserProjects(data);
    } catch (err) {
      setError('Failed to fetch user projects');
    }
  };

  const fetchAssignedBugs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bugs/assigned-to-me', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok)
        throw new Error('Failed to fetch assigned bugs');
      const data = await response.json();
      setAssignedBugs(data);
    } catch (err) {
      setError('Failed to fetch assigned bugs');
    }
  };

  const fetchUnassignedBugs = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${projectId}/unassigned`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok)
        throw new Error('Failed to fetch unassigned bugs');
      const data = await response.json();
      setProjectBugs(data);
    } catch (err) {
      setError('Failed to fetch unassigned bugs');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      if (!response.ok)
        throw new Error('Failed to add project');
      setNewProject({
        name: '',
        repository: ''
      });
      setShowProjectForm(false);
      fetchProjects();
      fetchUserProjects();
    } catch (err) {
      setError('Failed to add project');
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProject(projectId);
    fetchUnassignedBugs(projectId);
  };

  const handleCloseForm = () => {
    setShowProjectForm(false);
    setNewProject({ name: '', repository: '' });
  };

  const handleUpdateBugStatus = async (bugId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${bugId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update bug status');
      fetchAssignedBugs();
    } catch (err) {
      setError('Failed to update bug status');
    }
  };

  const handleAssignBug = async (bugId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bugs/${bugId}/assign`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to assign bug');
      fetchUnassignedBugs(selectedProject);
      fetchAssignedBugs();
    } catch (err) {
      setError('Failed to assign bug');
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}/add-member`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to join project');
      fetchUserProjects();
    } catch (err) {
      setError('Failed to join project');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (showProjectForm) {
    return (
      <div className="dashboard-container">
        <h1>MP Dashobard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleLogout} className="logout-button">Logout</button>
        <div className="form">
          <h3>Add a project</h3>
          <form>
            <label>
              Project name
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({
                ...newProject,
                name: e.target.value
              })}
              required
            />
            <label>
              Repository URL
            </label>
            <input
              type="text"
              value={newProject.repository}
              onChange={(e) => setNewProject({
                ...newProject,
                repository: e.target.value
              })}
              required
            />
            <button type="button" onClick={handleAddProject}>Add project</button>
            <button type="button" onClick={handleCloseForm}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>MP Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <div className="tabs">
        <button onClick={() => setActiveTab(1)} className={activeTab === 1 ? 'active' : ''}>Projects</button>
        <button onClick={() => setActiveTab(2)} className={activeTab === 2 ? 'active' : ''}>Projects bugs</button>
        <button onClick={() => setActiveTab(3)} className={activeTab === 3 ? 'active' : ''}>Assigned bugs</button>
      </div>

      {activeTab === 1 && (
        <div className="dashboard-content">
          <div className="dashboard-section sectionleft">
            <h2>All projects</h2>
            <button onClick={() => setShowProjectForm(true)}>
              Add project
            </button>
            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  {project.name}
                  <button onClick={() => handleJoinProject(project.id)}>Join</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-section sectionright">
            <h2>My projects</h2>
            <ul>
              {userProjects.map((project) => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="dashboard-content">
          <div className="dashboard-section sectionleft">
            <h2>My projects</h2>
            <ul>
              {userProjects.map((project) => (
                <li key={project.id}>
                  <button onClick={() => handleSelectProject(project.id)}>{project.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-section sectionright">
            <h2>Unassigned bugs</h2>
            {selectedProject ? (
              <ul>
                {projectBugs.map((bug) => (
                  <li key={bug.id}>
                    <p><strong>Description:</strong> {bug.description}</p>
                    <p><strong>Severity:</strong> {bug.severity}</p>
                    <p><strong>Priority:</strong> {bug.priority}</p>
                    <p><strong>Status:</strong> {bug.status}</p>
                    <p><strong>Commit Link:</strong> <a href={bug.commitLink}>{bug.commitLink}</a></p>
                    <button onClick={() => handleAssignBug(bug.id)}>Assign</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Select a project to view its bugs.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="dashboard-section">
          <h2>Assigned bugs</h2>
          <ul>
            {assignedBugs.map((bug) => (
              <li key={bug.id}>
                <p><strong>Description:</strong> {bug.description}</p>
                <p><strong>Severity:</strong> {bug.severity}</p>
                <p><strong>Priority:</strong> {bug.priority}</p>
                <p><strong>Status:</strong> {bug.status}</p>
                <p><strong>Commit Link:</strong> <a href={bug.commitLink}>{bug.commitLink}</a></p>
                <div>
                  <label htmlFor={`status-${bug.id}`}>Change Status:</label>
                  <select
                    id={`status-${bug.id}`}
                    value={bugStatus[bug.id] || bug.status}
                    onChange={(e) => setBugStatus({ ...bugStatus, [bug.id]: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button onClick={() => handleUpdateBugStatus(bug.id, bugStatus[bug.id] || bug.status)}>Update</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MPDashboard;
