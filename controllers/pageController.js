const db = require('../config/db');

exports.home = (req, res) => {
    res.render('index');
};

exports.showRegister = (req, res) => {
    res.render('register');
};

exports.showLogin = (req, res) => {
    res.render('login');
};

exports.mailbox = async (req, res) => {
    try {
        const userId = req.session.user.id;

        // 1. Mensajes Recibidos (Inbox) - status sent, is_read whatever
        // Join with users to getsender name
        const [inbox] = await db.query(`
            SELECT m.*, u.username as sender_name 
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE m.receiver_id = ? AND m.status = 'sent' AND m.status != 'trash'
            ORDER BY m.created_at DESC
        `, [userId]);

        // 2. Destacados (Starred) - filter inbox where is_favorite = 1
        const starred = inbox.filter(msg => msg.is_favorite);

        // 3. Borradores (Drafts) - sent by me, status draft
        // Join with users to get receiver name (if exists, might be null if not saved yet?? 
        // actually database schema says receiver_id NOT NULL. Wait, if I create a draft without recipient? 
        // My save logic required recipient. So it's fine.)
        const [drafts] = await db.query(`
            SELECT m.*, u.username as receiver_name 
            FROM messages m 
            JOIN users u ON m.receiver_id = u.id 
            WHERE m.sender_id = ? AND m.status = 'draft' AND m.status != 'trash'
            ORDER BY m.updated_at DESC
        `, [userId]);

        res.render('mailbox', {
            user: req.session.user,
            inbox,
            starred,
            drafts
        });

    } catch (error) {
        console.error('Error fetching mailbox:', error);
        res.status(500).send("Error al cargar el buzón");
    }
};