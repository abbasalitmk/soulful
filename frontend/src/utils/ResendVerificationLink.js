import axios from "axios"

const ResendVerificationLink = (props) => {

    const resend = (user) => {
        try {
            const response = axios.post('http://127.0.0.1:8000/user/resend-verification-link', {
                "user": user
            })
            if (response.status === 200) {
                console.log('success');
            }
        }
        catch (error) {
            console.log('error');
        }
    }


}

export default ResendVerificationLink