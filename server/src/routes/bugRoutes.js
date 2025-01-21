const express = require('express');
const router = express.Router();
const { Bug, Project } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

//lista cu bugurile de la proiectele la care utiliz este membru
router.get('/user-bugs', authenticateToken, async (req, res) => {
    try {
        const userProjects = await req.user.getProjects({
            include: [{ model: Bug }],
        });

        if (!userProjects || userProjects.length === 0) {
            return res.status(404).json({
                error: 'No projects found for the current user'
            });
        }

        const userBugs = userProjects.reduce((bugs, project) => {
            return bugs.concat(project.Bugs);
        }, []);

        res.status(200).json(userBugs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch bugs for the user'
        });
    }
});

//lista cu bugurile fara user asociat
router.get('/:projectId/unassigned', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        projectId
    } = req.params;

    try {

        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        const bugs = await Bug.findAll({
            where: {
                assignedTo: null,
                projectId
            }
        });
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch unassigned bugs for the project'
        });
    }
});

//lista cu bugurile asociate user curent
router.get('/assigned-to-me', authenticateToken, checkRole('MP'), async (req, res) => {
    try {
        const bugs = await Bug.findAll({
            where: {
                assignedTo: req.user.id
            }
        });
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch bugs assigned to the user'
        });
    }
});

// lista cu bugurile unui proiect
router.get('/:projectId', authenticateToken, async (req, res) => {
    const {
        projectId
    } = req.params;

    try {
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found'
            });
        }

        const bugs = await Bug.findAll({
            where: {
                projectId
            }
        });
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch bugs for the project'
        });
    }
});

//creare bug
router.post('/', authenticateToken, checkRole('TST'), async (req, res) => {
    const {
        severity,
        priority,
        description,
        commitLink,
        projectId
    } = req.body;

    try {
        const newBug = await Bug.create({
            severity,
            priority,
            description,
            commitLink,
            projectId
        });
        res.status(201).json(newBug);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create bug'
        });
    }
});

//asociere bug cu user curent
router.put('/:id/assign', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const bug = await Bug.findByPk(id);
        if (!bug) {
            return res.status(404).json({
                error: 'Bug not found'
            });
        }

        bug.assignedTo = req.user.id;
        await bug.save();

        res.status(200).json(bug);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to assign bug'
        });
    }
});

// actualizare status
router.put('/:id', authenticateToken, checkRole('MP'), async (req, res) => {
    const {
        id
    } = req.params;

    const {
        status, commitLink
    } = req.body;

    try {
        const bug = await Bug.findByPk(id);
        if (!bug) {
            return res.status(404).json({
                error: 'Bug not found'
            });
        }

        bug.status = status || bug.status;
        bug.commitLink = commitLink || bug.commitLink;
        await bug.save();
        res.status(200).json(bug);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update bug status'
        });
    }
});

module.exports = router;