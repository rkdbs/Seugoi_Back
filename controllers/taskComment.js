const { User, TaskComment } = require('../models');

// 스터디 댓글 등록
exports.createComment = async (req, res) => {
    try {
        const {
            user_id, study_id, content
        } = req.body;

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: '존재하지 않는 유저입니다.' });
        }

        const createcomment = await TaskComment.create({
            user_id: Number(user_id),
            study_id: Number(study_id),
            content: content,
            image: req.file ? req.file.originalname : null
        });

        return res.status(200).json({ message: '댓글이 성공적으로 달렸습니다.' });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류로 댓글이 달리지 않았습니다.' });
    }
}

// 스터디 댓글 모두 조회
exports.allTaskComment = async (req, res) => {
    try {
        const comments = await TaskComment.findAll();
        const userIds = comments.map(comment => comment.user_id);
        const users = await User.findAll({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: userIds
            }
        });

        // 사용자 세부 정보를 사용자 ID로 매핑
        const userMap = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const response = comments.map(comment => ({
            ...comment.dataValues,
            user: userMap[comment.user_id]
        }));

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "서버 오류로 모든 댓글 조회 실패" });
    }
}

// 특정 댓글 조회
exports.idComment = async (req, res) => {
    try {
        const comment_id = req.params.comment_id;
        const taskComment = await TaskComment.findOne({
            attributes: [
                'id', 'user_id', 'study_id',
                'content', 'image'
            ],
            where: {
                id: Number(comment_id)
            }
        })

        if (!taskComment) {
            return res.status(404).json({ error: "댓글을 찾을 수 없습니다." });
        }

        // 사용자 정보를 조회
        const user = await User.findOne({
            attributes: ['id', 'nickname', 'email', 'birthday', 'job'],
            where: {
                id: taskComment.user_id
            }
        });

        if (!user) {
            return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
        }

        const response = {
            ...taskComment.dataValues,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                birthday: user.birthday,
                job: user.job
            },
        };

        res.status(200).json(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "서버 오류로 특정 댓글 조회 실패" });
    }
}