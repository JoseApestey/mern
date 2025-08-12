export const isAdmin = (req, res, next) => {
  console.log('User en isAdmin:', req.user); // Debug
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Unauthorized: Admin role required' 
    });
  }
  next();
};
export const isUser = (req, res, next) => {
    if (req.user?.role !== 'user') {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Unauthorized: User role required' 
        });
    }
    next();
};

export const isUserOrAdmin = (req, res, next) => {
    if (!['user', 'admin'].includes(req.user?.role)) {
        return res.status(403).json({ 
            status: 'error', 
            message: 'Unauthorized: User or Admin role required' 
        });
    }
    next();
};