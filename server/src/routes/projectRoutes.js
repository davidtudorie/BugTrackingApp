const express = require('express');
const router = express.Router();
const { Project, User, Bug } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// lista cu toate proiectele
router.get('/', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch projects'
        });
    }
});

//lista cu toate proiectele userului curent
router.get('/user-projects', authenticateToken, async (req, res) => {
    try {
        const projects = await req.user.getProjects();
        if (!projects || projects.length === 0) {
            return res.status(404).json({
                error: 'No projects found for the current user'
            });
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch projects'
        });
    }
});


// creare proiect
router.post('/', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        name,
        repository
    } = req.body;

    try {
        const newProject = await Project.create({
            name,
            repository
        });

        const currentUser = await User.findByPk(req.user.id);
        await newProject.addMember(currentUser);

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create project'
        });
    }
});

// adaugare user curent la proiect dupa id
router.post('/:id/add-member', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        const currentUser = await User.findByPk(req.user.id);

        await project.addMember(currentUser, {
            through: {
                role: 'MP'
            }
        });
        res.status(200).json({
            message: 'User added successfully as a member'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to add user to project'
        });
    }
});

// stergere membru de la proiect
router.delete('/:id/remove-member/:userId', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        id,
        userId
    } = req.params;

    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await project.removeMember(user);
        res.status(200).json({
            message: 'Member removedy'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to remove member from project'
        });
    }
});

//lista buguri de la un proiect dupa id
router.get('/:id/bugs', authenticateToken, async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const project = await Project.findByPk(id, {
            include: [Bug],
        });

        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        res.status(200).json(project.Bugs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch bugs for the project'
        });
    }
});

module.exports = router;