import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);
            if (location.pathname === '/' ||
                location.pathname === '/LogInPage' ||
                location.pathname === '/RegisterPage'
            ) {
                navigate('/Home', { replace: false });
            }
        }
    }, [location, navigate, setIsAuthenticated])

    return (
        null
    )
}

export default RefrshHandler