// middleware/simpleAuth.js
export const isAuthenticated = (req, res, next) => {
    const sessionId = req.cookies.mym_session;
    
    if (!sessionId || !activeSessions[sessionId]) {
      return res.status(401).json({ 
        success: false, 
        msg: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS' 
      });    }
  
    req.user = activeSessions[sessionId];
    next();
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ success: false, msg: 'Se requieren privilegios de administrador' });
    }
    next();
  };