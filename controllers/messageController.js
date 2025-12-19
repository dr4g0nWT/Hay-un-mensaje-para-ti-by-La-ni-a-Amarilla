const db = require('../config/db');

// GUARDAR O ACTUALIZAR MENSAJE
exports.saveMessage = async (req, res) => {
    try {
        const { id, recipient, subject, content, status } = req.body;
        const sender = req.session.user;

        if (!sender) return res.status(401).json({ success: false, message: 'No autenticado' });

        // 1. Buscar Destinatario
        let receiverId = null;
        if (recipient) {
            const [users] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [recipient, recipient]);
            if (users.length > 0) receiverId = users[0].id;
            else if (status === 'sent') {
                return res.status(404).json({ success: false, message: 'Destinatario no encontrado.' });
            }
        }

        const finalSubject = (subject && subject.trim() !== '') ? subject : '(Sin asunto)';
        const finalContent = content || '';

        // 2. Si viene ID, es UPDATE (solo si soy el dueño)
        if (id) {
            // Verificar ownership
            const [msg] = await db.query('SELECT * FROM messages WHERE id = ? AND sender_id = ?', [id, sender.id]);
            if (msg.length === 0) return res.status(403).json({ success: false, message: 'No tienes permiso o mensaje no existe' });

            // Update
            await db.query(`
                UPDATE messages 
                SET receiver_id = ?, subject = ?, content = ?, status = ?, updated_at = NOW()
                WHERE id = ?
            `, [receiverId, finalSubject, finalContent, status, id]);

            return res.json({ success: true, message: 'Mensaje actualizado.' });

        } else {
            // 3. INSERT (Nuevo)
            // Si es draft y no tiene receiver, receiver_id puede ser NULL?
            // Mi esquema definía receiver_id NOT NULL. Tengo que ver qué hago.
            // Si es draft, permitamos que falle si no hay receiver? O ponemos sender como receiver temporal?
            // Requerimiento: "Borradores... dejar editarlo".
            // Voy a requerir destinatario válido incluso para borradores por ahora para simplificar,
            // o si falla la busqueda de usuario y es draft, guardar NULL si la BD lo permite.
            // INITDB dice: receiver_id INT NOT NULL.
            // Solution: Si es draft y no hay user, return error "Indica un destinatario válido para guardar borrador".

            if (!receiverId) {
                return res.status(400).json({ success: false, message: 'Debes indicar un destinatario válido.' });
            }

            await db.query(`
                INSERT INTO messages (sender_id, receiver_id, subject, content, status, is_read, created_at)
                VALUES (?, ?, ?, ?, ?, 0, NOW())
            `, [sender.id, receiverId, finalSubject, finalContent, status]);

            return res.json({ success: true, message: 'Mensaje creado.' });
        }

    } catch (error) {
        console.error('Error saving message:', error);
        return res.status(500).json({ success: false, message: 'Error interno.' });
    }
};

// TOGGLE FAVORITO
exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.session.user.id;

        // Solo puedo destacar mensajes que HE RECIBIDO (inbox) O quizas enviados? 
        // Gmail permite destacar recibidos. Asumamos recibidos.
        // Pero tambien podria destacar mis enviados.
        // La query busca mensaje donde yo sea sender O receiver.
        const [rows] = await db.query('SELECT * FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)', [id, userId, userId]);

        if (rows.length === 0) return res.status(403).json({ success: false });

        const currentVal = rows[0].is_favorite;
        await db.query('UPDATE messages SET is_favorite = ? WHERE id = ?', [!currentVal, id]);

        res.json({ success: true, is_favorite: !currentVal });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

// ELIMINAR (Soft delete a trash)
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;
        const userId = req.session.user.id;

        // Verificar que soy sender o receiver
        const [rows] = await db.query('SELECT * FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)', [id, userId, userId]);
        if (rows.length === 0) return res.status(403).json({ success: false, message: 'No autorizado' });

        // Update status to 'trash'
        // PREGUNTA: Si borro un mensaje que envié, ¿se le borra al destinatario?
        // Gmail: Si borro enviado, se borra de MI vista.
        // Si borro recibido, se borra de MI vista.
        // Si compartimos la misma fila en DB... status es único.
        // Si status pasa a TRASH, desaparece para AMBOS.
        // RIESGO: Si yo borro un mensaje que te envié, tú dejas de verlo.
        // SOLUCION IDEAL: Flags deleted_by_sender, deleted_by_receiver.
        // PERO: No puedo cambiar schema facilmente sin permiso (aunque tengo `initDB.sql`).
        // REVISAR SCHEMA: initDB.sql tiene status ENUM('sent', 'draft', 'trash'). 
        // Si cambio status a trash, afecta a los dos.
        // COMPROMISO: Por ahora, "Eliminar" lo mueve a trash y desaparece para ambos. 
        // Avisaré al usuario en el walkthrough de esta limitación del modelo actual.
        // O mejor: Si soy sender y es draft -> trash. Si es sent, no puedo borrarlo "para mi" sin afectar al otro con este modelo.
        // Voy a asumir comportamiento "Global" por simplicidad del modelo actual, o simular borrado físico si es draft.

        if (rows[0].status === 'draft') {
            // Si es borrador, delete físico
            await db.query('DELETE FROM messages WHERE id = ?', [id]);
        } else {
            // Si es mensaje enviado, mover a trash (afecta a los dos)
            await db.query("UPDATE messages SET status = 'trash' WHERE id = ?", [id]);
        }

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
