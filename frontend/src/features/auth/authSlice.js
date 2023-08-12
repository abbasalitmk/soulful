import { createSlice } from '@reduxjs/toolkit'
import { useNavigate } from 'react-router-dom';



const authSlice = createSlice(

    {
        name: 'auth',
        initialState: {
            token: JSON.parse(localStorage.getItem('access')) || null,
            isAuthenticated: localStorage.getItem('access') ? true : false,
            user: localStorage.getItem('user') || null
        },
        reducers: {
            setToken: (state, action) => {
                state.token = action.payload;
                state.isAuthenticated = true;
            },
            clearToken: (state) => {
                state.token = null;
                localStorage.removeItem('access');
                state.isAuthenticated = false;
            },
            setUser: (state, action) => {
                state.user = action.payload
            }

        }
    }

)

export const { setToken, clearToken, setUser } = authSlice.actions;
export default authSlice.reducer;