import Navbar from "../components/Navbar/Navbar"

const EmailVerificationPage = () => {


    return (
        <div>
            <div className='container'>
                <Navbar />

                <div className='d-flex justify-content-center align-items-center pt-5 mt-5'>
                    <div className='text-center'>
                        <h1>Please verify your email</h1>
                        <h4>Verification link sent to your Email</h4>
                        {/* <button onClick={resendVerificationLink} className="mt-3 btn btn-primary">Resend</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailVerificationPage